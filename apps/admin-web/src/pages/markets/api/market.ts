import { GET_MARKETS } from "@/config/constants";
import type {
	LIMIT,
	MARKET_CATEGORY,
	MARKET_STATUS,
	MarketData,
} from "../types/market";

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

const paginatedQuery = async (pageParam: number): Promise<{
	totalCount: number;
	currentPage: number;
	nextPage: number | null;
	totalPage: number;
	data: any[];
}> => {
	const params = new URLSearchParams({
		limit: "15",
		pageParam: String(pageParam)
	});

	const res = await fetch(
		`http://localhost:3333/api/v0/market/data/page?${params}`,
		{ method: "GET" },
	);

	const response = await res.json();

	if (!response.success) {
		throw new Error(response.message);
	}

	return response.data;
};

export { fetchMarkets, paginatedQuery };
