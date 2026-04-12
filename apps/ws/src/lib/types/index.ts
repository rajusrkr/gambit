import type { WebSocket } from "ws";

interface ExtendedSocket extends WebSocket {
	isAlive: boolean;
}
type PageRef = Map<ExtendedSocket, string>;
type Rooms = Map<string, Set<ExtendedSocket>>;
type Users = Map<ExtendedSocket, Set<string>>;

export type { ExtendedSocket, PageRef, Rooms, Users };
