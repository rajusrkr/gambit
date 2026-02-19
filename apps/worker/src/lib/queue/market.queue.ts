import { db, market } from "@repo/db";
import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import Redis from "ioredis";

type MarketStatus =
  | "open"
  | "open_soon"
  | "settled"
  | "canceled"
  | "new_order_paused";

class MarketQueue {
  private redis: Redis;
  constructor(redis: Redis) {
    this.redis = redis;
  }

  marketOpen() {
    new Worker(
      "market_open",
      async (job) => {
        const marketId = job.data.marketId;
        await this.updateMarketStatus({ marketId, marketStatus: "open" });
      },
      { connection: this.redis },
    ).on("completed", (job) =>
      console.log(`Market with id: ${job.data.marketId} is now open`),
    );
  }

  marketOrderPause() {
    new Worker(
      "market_pause",
      async (job) => {
        const marketId = job.data.marketId;
        await this.updateMarketStatus({
          marketId,
          marketStatus: "new_order_paused",
        });
      },
      { connection: this.redis },
    ).on("completed", (job) =>
      console.log(
        `Market with id: ${job.data.marketId} has been paused for new orders.`,
      ),
    );
  }

  private async updateMarketStatus({
    marketId,
    marketStatus,
  }: {
    marketId: string;
    marketStatus: MarketStatus;
  }) {
    try {
      await db
        .update(market)
        .set({ marketStatus: marketStatus })
        .where(eq(market.id, marketId));
    } catch (error) {
      throw new Error(
        `Unable to change status for market id: ${marketId}, Reason: ${error instanceof Error ? error.message.toString() : "Internal problem"}`,
      );
    }
  }
}

export { MarketQueue };
