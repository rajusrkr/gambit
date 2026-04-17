import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMarkets, paginatedQuery } from "../api/market";
import type { LIMIT, MARKET_CATEGORY, MARKET_STATUS } from "../types/market";

export const useMarket = ({
	category,
	status,
	limit,
}: {
	category: MARKET_CATEGORY;
	status: MARKET_STATUS;
	limit: LIMIT;
}) => {
	const marketQuery = useQuery({
		queryKey: ["fetch-markets"],
		queryFn: () => fetchMarkets({ category, limit, status }),
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	return { data: marketQuery.data, isLoading: marketQuery.isPending };
};

export const useMarketPaginationQuery = () => {
	const paginationQuery = useInfiniteQuery({
		queryKey: ["paginated-markets"],
		queryFn: ({pageParam}) => paginatedQuery(pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextPage,
	});

	return { data: paginationQuery.data, next: paginationQuery.fetchNextPage };
};
