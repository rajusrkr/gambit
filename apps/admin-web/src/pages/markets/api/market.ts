import { GET_MARKETS } from "@/config/constants";
import type { LIMIT, MARKET_CATEGORY, MARKET_STATUS, MarketData } from "../types/market";

/**
 * Market fetch function.
 */

const fetchMarkets = async ({
	status,
	category,
	limit,
}: {
	status: MARKET_STATUS;
	category: MARKET_CATEGORY;
	limit: LIMIT;
}): Promise<MarketData[]> => {
	const params = new URLSearchParams({
		status: status,
		category: category,
		limit: limit,
	});
	const res = await fetch(`${GET_MARKETS}?${params.toString()}`, {
		method: "GET",
		credentials: "include",
	});

	const response = await res.json();

	if (!response.success) {
		throw new Error(response.message);
	}

	return response.markets;
};

export { fetchMarkets };
