import { BACKEND_URL } from "@/config/constants";
import type { LatestPrice } from "../types";

const fetchLatestMarketPrices = async ({
	params,
}: {
	params: URLSearchParams;
}): Promise<Record<string, LatestPrice>> => {
	const res = await fetch(
		`${BACKEND_URL}/market/data/get-latest-price?${params}`,
		{
			method: "GET",
			credentials: "include",
		},
	);
	const response = await res.json();

	if (!response.success) {
		throw new Error(response.message);
	}

	const latestPrice = response.latestPrice as LatestPrice[];

	return latestPrice.reduce(
		(acc, item) => {
			acc[item.marketId] = item;
			return acc;
		},
		{} as Record<string, LatestPrice>,
	);
};

export { fetchLatestMarketPrices };
