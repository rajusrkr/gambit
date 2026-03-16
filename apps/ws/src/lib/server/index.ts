import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { Duplex } from "stream";
import { ConnectionHandler } from "../connectionsHandler/index";
import { ExtendedSocket, PageRef, Rooms, Users } from "../types";

const wss = new WebSocketServer({ noServer: true });
const users: Users = new Map<ExtendedSocket, Set<string>>();
const rooms: Rooms = new Map<string, Set<ExtendedSocket>>();
const pageRef: PageRef = new Map<ExtendedSocket, string>();

const hanldeConnections = new ConnectionHandler(pageRef, rooms, users);

function authenticateUser(req: IncomingMessage): string | null {
  const cookies = req.headers.cookie;

  if (!cookies) return null;

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

function setupWS(server: any) {
  server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const userId = authenticateUser(req);

    // Auth check
    // if (!userId) {
    //   socket.write("401 unauthorized")
    //   socket.destroy()
    //   return;
    // }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  setInterval(() => {
    const userTable: any[] = [];
    const roomTable: any[] = [];

    for (const [key, roomSet] of users.entries()) {
      userTable.push({
        "Page Ref": pageRef.get(key),
        "Room(s)": [...(roomSet.values() || [])],
        "Room count": roomSet.size,
      });
    }
    for (const [key, value] of rooms.entries()) {
      roomTable.push({ Room: key, "Total users": value.size });
    }
    console.log("--- ACTIVE USER SUBSCRIPTIONS ---");
    console.table(userTable);
    console.log("----ROOMS INFO----");
    console.table(roomTable);
    console.log("TOTAL WSS Connection:", wss.clients.size);
  }, 5 * 1000);
}

wss.on("connection", (ws: ExtendedSocket) => {
  console.log("NEW CONNECTION");
  ws.on("message", (msg) => {
    try {
      const messageData = JSON.parse(msg.toString()) as {
        message: string;
        ticksToSub: string[];
        pageToSub: string;
      };

      ws.send(JSON.stringify({message: "Hey we have received your message"}))

      console.log(messageData);

      const { message, pageToSub, ticksToSub } = messageData;

      hanldeConnections.handleConnections(ticksToSub, pageToSub, ws);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error in parsing message";
      ws.send(JSON.stringify({ message: errorMessage }));
    }
  });

  ws.on("close", (code) => {
    console.log(code);
    console.log("connection has been closed by the user");
    hanldeConnections.handleConnectionClose(ws);
  });
});

export { setupWS };
