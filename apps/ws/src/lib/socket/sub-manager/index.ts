import { WebSocket } from "ws";

class SubscriptionManager {
  private tickers = new Map<string, Set<WebSocket>>(); // Map(3) {channelID => {"ws1", "ws2", ....}}
  private users = new Map<WebSocket, Set<string>>(); // Map(3) {ws => {channelID, channelID, ...}}
  private userPageRef = new Map<WebSocket, string>()

  subscribe(ws: WebSocket, channelsToSubcribe: string[]) {
    if (!this.users.has(ws)) this.users.set(ws, new Set());

    channelsToSubcribe.forEach((ch) => {
      if (!this.tickers.has(ch)) this.tickers.set(ch, new Set());
      this.tickers.get(ch)!.add(ws);
      this.users.get(ws)!.add(ch);
    });
  }

  add(ws: WebSocket, tickersToSub: string[]) {
    if (!this.users.has(ws)) this.users.set(ws, new Set());

    tickersToSub.forEach((ticker) => {
      if (!this.tickers.has(ticker)) this.tickers.set(ticker, new Set());



      if (this.users.get(ws)?.has(ticker)) {
// Then return do nothing
        
      }


      // remove those ws from the tickers



    });
  }
  unsubscribeAll(ws: WebSocket) {
    const subs = this.users.get(ws);
    if (!subs) return;

    subs.forEach((ch) => {
      const subscribers = this.tickers.get(ch);

      if (subscribers) {
        subscribers.delete(ws);

        if (subscribers.size === 0) {
          this.tickers.delete(ch);
        }
      }
    });
    this.users.delete(ws);
  }

  // There is no use of this broadCast function
  broadCast(channel: string, data: Buffer | Uint8Array) {
    const subscribers = this.tickers.get(channel);

    if (!subscribers) return;

    for (const client of subscribers) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: true });
      }
    }
  }
}

export { SubscriptionManager };
