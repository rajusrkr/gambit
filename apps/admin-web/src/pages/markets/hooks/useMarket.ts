import { useInfiniteQuery } from "@tanstack/react-query";
import { GET_MARKETS } from "@/config/constants";
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
	const getPaginatedMarketQuery = useInfiniteQuery({
		queryKey: ["markets", category, status],
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
			return response.markets;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
		retry: 1,
	});

	return {
		markets: getPaginatedMarketQuery.data?.pages[0].marketsData,
		fetchNextPage: getPaginatedMarketQuery.fetchNextPage,
		isLoading:
			getPaginatedMarketQuery.isLoading || getPaginatedMarketQuery.isPending,
		isFetchingNextPage: getPaginatedMarketQuery.isFetchingNextPage,
	};
};

export { useMarket };
