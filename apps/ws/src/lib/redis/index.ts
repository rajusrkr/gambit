import { WebSocket } from "ws";

class SubscriptionManager {
  private channels = new Map<string, Set<WebSocket>>();
  private clients = new Map<WebSocket, Set<string>>();

  subscribe(ws: WebSocket, channelsToSubcribe: string[]) {
    if (!this.clients.has(ws)) this.clients.set(ws, new Set());

    channelsToSubcribe.forEach((ch) => {
      if (!this.channels.has(ch)) this.channels.set(ch, new Set());
      this.channels.get(ch)!.add(ws);
      this.clients.get(ws)!.add(ch);
    });
  }

  unsubscribeAll(ws: WebSocket) {
    const subs = this.clients.get(ws);
    if (!subs) return;

    subs.forEach((ch) => {
      const subscribers = this.channels.get(ch);

      if (subscribers) {
        subscribers.delete(ws);

        if (subscribers.size === 0) {
          this.channels.delete(ch);
        }
      }
    });
    this.clients.delete(ws);
  }

  broadCast(channel: string, data: Buffer | Uint8Array) {
    const subscribers = this.channels.get(channel);

    if (!subscribers) return;

    for (const client of subscribers) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: true });
      }
    }
  }
}

export { SubscriptionManager };
