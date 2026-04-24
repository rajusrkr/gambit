import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../api/market";
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
