import { useQuery } from "@tanstack/react-query";
import { useWebsocket } from "@/components/web-socket-provider";
import { BACKEND_URL } from "@/lib/utils";

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

export interface LatestPrice {
	marketId: string;
	prices: {
		price: string;
		title: string;
		volume: number;
	}[];
}
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

/**
 * Fetch latest prices from this fetch function
 */
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

/**
 * Get matkets data for user home page cards.
 * and get latest price data
 */
export const useMarkets = () => {
	const { sendMessage } = useWebsocket();

	/**
	 * Getting markets
	 */
	const marketQuery = useQuery({
		queryKey: ["fetch-markets"],
		queryFn: async (): Promise<MarketData[]> => {
			const res = await fetch(`${BACKEND_URL}/market/data/get-markets`, {
				method: "GET",
				credentials: "include",
			});

			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			const marketIds: string[] = [];
			response.markets.forEach((market: MarketData) => {
				marketIds.push(market.marketId);
			});

			sendMessage({
				type: "TICKER_UPDATE",
				message: "Sub to ticks",
				payload: { pageRef: "home", roomsToSub: marketIds },
			});

			return response.markets;
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	const markets = marketQuery.data?.length;
	const params = new URLSearchParams(); // Params to store market ids
	marketQuery.data?.forEach((market) => {
		params.append("id", market.marketId);
	});

	/**
	 * Getting the latest prices by those markets id
	 */
	const marketLatestPriceQuery = useQuery({
		queryKey: ["fetch-latest-price"],
		queryFn: () => fetchLatestMarketPrices({ params }),
		enabled: !!markets,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	console.log(marketLatestPriceQuery.data);

	return {
		isPending: marketQuery.isPending || marketLatestPriceQuery.isPending,
		marketQueryError: marketQuery.error,
		marketLatestPriceQueryError: marketLatestPriceQuery.error,
		market: marketQuery.data,
		latestPrice: marketLatestPriceQuery.data,
	};
};

/**
 * Get market by id and latest market data for the market
 */
export const useMarketById = (marketId: string) => {
	const getMarketById = useQuery({
		queryKey: ["fetch-market-by-id"],
		queryFn: async (): Promise<MarketById> => {
			const res = await fetch(
				`${BACKEND_URL}/market/data/get-market-by-id?marketId=${marketId}`,
				{
					method: "GET",
					credentials: "include",
				},
			);

			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			console.log(response.marketById.id);

			return response.marketById;
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	const market = getMarketById.data?.id;

	const marketLatestPriceQuery = useQuery({
		queryKey: ["fetch-latest-price"],
		queryFn: () =>
			fetchLatestMarketPrices({ params: new URLSearchParams({ id: market! }) }),
		enabled: !!market,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	return {
		isPending: getMarketById.isPending || marketLatestPriceQuery.isPending,
		marketQueryError: getMarketById.error,
		marketLatestPriceQueryError: marketLatestPriceQuery.error,
		market: getMarketById.data,
		latestPrice: marketLatestPriceQuery.data,
	};
};
