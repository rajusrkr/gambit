import Redis from "ioredis";
import { WebSocket } from "ws";

class Sub {
  private readonly host = "127.0.0.1";
  private readonly port = 6379;
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: this.host,
      port: this.port,
    });
  }

  listenForMessage() {
    this.redis.on("message", (channel, message) => {
      /**
       * Get the message
       * 
       * 
       * Message will be type of price_update, portfolio_update, etc....
       * type will be there other wise i cant identify the type of the update -THIS MIGHT NOT REQUIRED
       * 
       * THIS IS ONLY FOR PRICE UPDATE
       * marketID is the channel id,
       * get the market id.
       * get clients by market id
       * send those clients the data.
       * 
       * THIS IS ONLY FOR PORTFOLIO UPDATE - updates like qty
       * for this i need the user id, there are no other way.
       * EVERY PORTFOLIO HAVE THERE OWN UNIQUEUE ID SO I CAN USE THAT AS CHANNEL ID
       */
    });
  }
}
