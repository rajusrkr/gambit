interface MarketData {
	marketId: string;
	marketTitle: string;
	outcomes: {
		title: string;
		price: string;
		volume: number;
	}[];
	marketStatus: string;
	marketCategory: string;
}

type MARKET_CATEGORY = "sports" | "crypto" | "weather" | "all";
type MARKET_STATUS =
	| "open"
	| "settled"
	| "new_order_paused"
	| "open_soon"
	| "canceled"
	| "all";
type LIMIT = "3" | "5" | "10" | "15" | "20";

export type { LIMIT, MARKET_CATEGORY, MARKET_STATUS, MarketData };
