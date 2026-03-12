import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { Duplex } from "stream";

interface ExtendWebSocket extends WebSocket {
  isAlive: boolean;
}

const wss = new WebSocketServer({ noServer: true });

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

      // if (!userId) {
      //   socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      //   socket.destroy();
      //   return;
      // }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    },
  );
}

wss.on("connection", (ws: ExtendWebSocket) => {
  console.log("New connection established");
  ws.on("message", (msg) => {
    // channel id = "123_random"
    // redis.sub("channel_id")

    try {
      const data = JSON.parse(msg.toString());
      console.log(data);
      ws.send(JSON.stringify({ message: "Your message was", data }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to parse your message"
      console.log(errorMessage);
      ws.send(JSON.stringify({message: errorMessage}))
    }
  });
});
