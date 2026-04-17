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

interface MarketsData {
	totalCount: number;
	currentPage: number;
	nextPage: number;
	totalPage: number;
	marketsData: MarketData[];
}

type MARKET_CATEGORY = "sports" | "crypto" | "weather" | "all";
type MARKET_STATUS =
	| "open"
	| "settled"
	| "new_order_paused"
	| "open_soon"
	| "canceled"
	| "all";
type LIMIT = "21" | "31" | "41";

interface LatestPrice {
	marketId: string;
	prices: {
		price: string;
		title: string;
		volume: number;
	}[];
}

export type {
	LatestPrice,
	LIMIT,
	MARKET_CATEGORY,
	MARKET_STATUS,
	MarketData,
	MarketsData,
};
