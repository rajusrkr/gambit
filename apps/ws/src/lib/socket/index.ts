/**
 * Redis pub sub
 *
 *
 *
 * subscribing happens at the time of connection.
 *
 * a check will be made - if the channel exists admit the user, if not exists first create the channel then admit the user
 *
 *
 *
 * The payload for first connection:
 * {
 * connectionType: "new"
 * type: "sub",
 * subTo: "prices",
 * ticks:string[]
 * },
 *
 * The payload for second or third.. connection:
 * This is like swaping the old channels with new channels
 *
 * {
 * connectionType: "old",
 * type: "changeSub",
 * subTo: "prices",
 * newTicks: string[]
 *
 * }
 */

import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { Duplex } from "stream";

interface ExtendWebSocket extends WebSocket {
  isAlive: boolean;
}

const wss = new WebSocketServer({ noServer: true });
const rooms = new Map<ExtendWebSocket, string>();

function authenticate(req: IncomingMessage): string | null {
  const cookies = req.headers.cookie;
  if (!cookies) {
    return null;
  }
  try {
    const cookieObj = Object.fromEntries(
      cookies.split(";").map((c) => c.trim().split("=")),
    );
    const decode = jwt.verify(
      cookieObj.socketIdentity,
      `${process.env.SOCKET_JWT_SECRET}`,
    ) as { userId: string };
    return decode.userId;
  } catch (error) {
    return null;
  }
}

export function setUpWS(server: any) {
  server.on(
    "upgrade",
    (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      const userId = authenticate(request);

      if (!userId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        rooms.set(ws as ExtendWebSocket, userId);
        wss.emit("connection", ws, request);
      });
    },
  );
}

wss.on("connection", (ws: ExtendWebSocket) => {
  console.log("New connection established");
  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    console.log(data);

    ws.send(JSON.stringify({ message: "Hey there" }));
  });
});

setInterval(() => {
  console.log(rooms);
}, 20 * 1000);
