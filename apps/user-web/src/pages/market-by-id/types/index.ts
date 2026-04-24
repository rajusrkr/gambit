interface MarketById {
  id: string;
  title: string;
  description: string;
  settlementRules: string;
  marketType: string;
  closing: number;
  marketStatus: string;
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
}

interface PositionByMarketId {
  positionId: string;
  marketId: string;
  outcome: string;
  avgPrice: string;
  positionQty: number;
  tradeCost: string;
}

interface LatestPrice {
  marketId: string;
  prices: {
    price: string;
    title: string;
    volume: number;
  }[];
}

interface OrderHistoy {
  outcome: string;
  qty: number;
  avgPrice: string;
  orderedBy: string;
  orderId: string;
}

interface PriceHistory {
  prices: {
    price: string;
    title: string;
    volume: number;
  }[];
  time: string;
}

type MarketStatus =
  | "open"
  | "settled"
  | "new_order_paused"
  | "open_soon"
  | "canceled";

interface Discussions {
  id: string;
  message: string;
  userName: string;
  userId: string;
}

interface SellOrderData {
  positionId: string;
  marketId: string;
  orderType: "buy" | "sell";
  orderQty: number;
  selectedOutcome: string;
}
interface BuyOrderData {
  marketId: string;
  orderType: "buy" | "sell";
  orderQty: number;
  selectedOutcome: string;
}

interface Outcomes {
  outcomeTitle: string;
  price: string;
  volume: number;
}

export type {
  BuyOrderData,
  Discussions,
  LatestPrice,
  MarketById,
  MarketStatus,
  Outcomes,
  OrderHistoy,
  PositionByMarketId,
  PriceHistory,
  SellOrderData,
};
