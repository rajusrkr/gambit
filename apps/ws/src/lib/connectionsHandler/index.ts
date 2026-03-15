import { ExtendedSocket, PageRef, Rooms, Users } from "../types";

class ConnectionHandler {
  private readonly pageRef: PageRef;
  private readonly rooms: Rooms;
  private readonly users: Users;

  constructor(pageRef: PageRef, rooms: Rooms, users: Users) {
    this.pageRef = pageRef;
    this.rooms = rooms;
    this.users = users;
  }

  handleConnections(
    ticksToSub: string[],
    pageToSub: string,
    ws: ExtendedSocket,
  ) {
    // If the current page ref != page provided by the user
    if (this.pageRef.has(ws) && this.pageRef.get(ws) !== pageToSub) {
      // Check if the user exists in the user Map and getting the user room
      if (!this.users.has(ws)) return;
      const roomsFromUser = this.users.get(ws);
      if (!roomsFromUser) return;

      // For each room get the room -> user's Set
      // If user Set found with the room ref then delete the user ws ref
      // At the end if the Set size is 0 then delete the entire room
      roomsFromUser.forEach((room) => {
        if (!this.rooms.has(room)) return;
        const findUser = this.rooms.get(room);
        if (!findUser) return;
        findUser.delete(ws);
        if (findUser.size === 0) this.rooms.delete(room);
      });
      // Delete the user's Map
      // And delet the page Ref Map
      this.users.delete(ws);
      this.pageRef.delete(ws);
    }
    // Put user's data in the appropriate places

    //if page ref does not have the ws then create and give the page as value
    if (!this.pageRef.has(ws)) this.pageRef.set(ws, pageToSub);
    // If no ws exists in the user Map then create one
    if (!this.users.has(ws)) this.users.set(ws, new Set());
    // For each tick provided by the user create a room
    // Get the room by tick and add ws
    // And at the end get the user Map by ws and then add tick in User Map
    ticksToSub.forEach((tick) => {
      if (!this.rooms.has(tick)) this.rooms.set(tick, new Set());
      const getRoom = this.rooms.get(tick);
      if (!getRoom) return;
      getRoom.add(ws);
      const getUser = this.users.get(ws);
      if (!getUser) return;
      getUser.add(tick);
    });
  }

  handleConnectionClose(ws: ExtendedSocket) {
    /**
     * If a connection get closed the
     * Delete page ref
     * Delete user from users Map
     * Delete user from room
     */

    // Get rooms that the user sub in
    const getRoomFromUser = this.users.get(ws);
    if (!getRoomFromUser) return;
    // For each room get the ws Set and then delete them by ws reference
    // At the end if the room size is 0 delet the entire room
    getRoomFromUser.forEach((room) => {
      const findRoom = this.rooms.get(room);
      if (!findRoom) return;
      findRoom.delete(ws);
      if (findRoom.size === 0) this.rooms.delete(room);
    });
    // Delete user and page ref
    this.users.delete(ws);
    this.pageRef.delete(ws);
    // Handle sub deletion from redis
  }
}

export { ConnectionHandler };
