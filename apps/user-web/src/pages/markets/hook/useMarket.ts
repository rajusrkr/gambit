import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useWebsocket } from "@/components/web-socket-provider";
import { GET_MARKETS } from "@/config/constants";
import { fetchLatestMarketPrices } from "../api/market";
import type {
	LIMIT,
	MARKET_CATEGORY,
	MARKET_STATUS,
	MarketData,
	MarketsData,
} from "../types";

const useMarket = ({
	limit,
	category,
	status,
}: {
	limit: LIMIT;
	category: MARKET_CATEGORY;
	status: MARKET_STATUS;
}) => {
	const { sendMessage } = useWebsocket();

	const getPaginatedMarketQuery = useInfiniteQuery({
		queryKey: ["markets"],
		queryFn: async ({ pageParam }): Promise<MarketsData> => {
			const params = new URLSearchParams({
				pageParam: pageParam.toString(),
				limit,
				category,
				status,
			});
			const res = await fetch(`${GET_MARKETS}?${params.toString()}`, {
				method: "GET",
				credentials: "include",
			});

			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			const marketIds: string[] = [];

			response.markets.marketsData.forEach((market: MarketData) => {
				marketIds.push(market.marketId);
			});

			sendMessage({
				type: "TICKER_UPDATE",
				message: "Sub to tick",
				payload: { pageRef: "home", roomsToSub: marketIds },
			});

			return response.markets;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	const markets = getPaginatedMarketQuery.data?.pages[0].marketsData.length;
	const params = new URLSearchParams();
	getPaginatedMarketQuery.data?.pages[0].marketsData.forEach((market) => {
		params.append("id", market.marketId);
	});

	const marketLatestPriceQuery = useQuery({
		queryKey: ["fetch-latest-price"],
		queryFn: () => fetchLatestMarketPrices({ params }),
		enabled: !!markets,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	const marketData = {
		markets: getPaginatedMarketQuery.data?.pages[0].marketsData,
		latestPrices: marketLatestPriceQuery.data,
		fetchNextPage: getPaginatedMarketQuery.fetchNextPage,
		isLoading: getPaginatedMarketQuery.isLoading || marketLatestPriceQuery.isLoading,
		isFethingNextPage: getPaginatedMarketQuery.isFetchingNextPage
	};

	return marketData;
};

export { useMarket };
