interface MarketRawData {
	marketId: string;
	marketTitle: string;
	outcomes: {
		titles: string[];
		volume: number[];
		prices: string[];
	};
	marketStatus:
		| "open"
		| "settled"
		| "new_order_paused"
		| "open_soon"
		| "canceled";
	marketCategory: "sports" | "crypto" | "weather";
}

interface ProcessedData {
	marketId: string;
	marketTitle: string;
	outcomes: {
		title: string;
		price: string;
		volume: number;
	}[];
	marketStatus:
		| "open"
		| "settled"
		| "new_order_paused"
		| "open_soon"
		| "canceled";
	marketCategory: "sports" | "crypto" | "weather";
}

/**
 * Provide raw market data and get processed data.
 * This function helps to map outcome title with the price and volume.
 * Before this function the data format look like this:
 * const data = [
 *  {
 *      marketId: string,
 *      ......,
 *      outcomes: {
 *          title: string[],
 *          price: string[],
 *          volume: number[]
 *      }
 *  }
 * ]
 *
 *
 * After using this function the data will look like this:
 * const data = [
 * {
 *  marketId: string,
 *  .......,
 *  outcomes: [
 *      {title: string, price: string, volume: number}
 *  ]
 * }
 * ]
 */
export function processMarketData({
	marketData,
}: {
	marketData: MarketRawData[];
}): ProcessedData[] {
	return marketData.map((market) => ({
		...market,
		outcomes: market.outcomes.titles.map((title, index) => ({
			title,
			price: market.outcomes.prices[index],
			volume: market.outcomes.volume[index],
		})),
	}));
}
