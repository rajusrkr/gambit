import { Queue } from "bullmq";
import { RedisClient } from "..";

const startMarketQueue = new Queue("market_open", { connection: RedisClient });
const newOrderPausedQueue = new Queue("market_pause", {
  connection: RedisClient,
});
const closeMarketQueue = new Queue("market_close", { connection: RedisClient });

export { startMarketQueue, closeMarketQueue, newOrderPausedQueue };
