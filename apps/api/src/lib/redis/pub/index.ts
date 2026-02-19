import Redis from "ioredis";

interface Outcome {
  title: string;
  price: number;
  volume: number;
}

interface PriceUpdate {
  marketId: string;
  outcome: Outcome[];
}

interface PortfolioUpdate {
  marketId: string;
  usertId: string;
  portfolio: {
    newQty: number;
    newAvgPrice: number;
  };
}

class Producer {
  private readonly host = "127.0.0.1";
  private readonly port = 6379;
  private redis: Redis;

  private readonly priceUpdateChannel = "price:update";
  private readonly portfolioUpdateChannel = "portfolio:update";
  private readonly priceUpdateMessage: PriceUpdate;
  private portfolioUpdateMessage: PortfolioUpdate;

  constructor(
    priceUpdateMessage: PriceUpdate,
    portfolioUpdateMessage: PortfolioUpdate,
  ) {
    this.redis = new Redis({
      host: this.host,
      port: this.port,
    });

    this.portfolioUpdateMessage = portfolioUpdateMessage;
    this.priceUpdateMessage = priceUpdateMessage;
  }

  async publishUpdatedPrices() {
    await this.redis.publish(
      this.portfolioUpdateChannel,
      JSON.stringify(this.priceUpdateMessage),
    );
  }

  async publishPortfolioUpdate() {
    this.redis.publish(
      this.portfolioUpdateChannel,
      JSON.stringify(this.portfolioUpdateMessage),
    );
  }
}

export { Producer };
