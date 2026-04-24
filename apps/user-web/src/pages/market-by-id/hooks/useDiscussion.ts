import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/config/constants";
import type { Discussions } from "../types";

export const useDiscussion = ({ marketId }: { marketId: string }) => {
	const discussionMarketQuery = useQuery({
		queryKey: ["discussion"],
		queryFn: async (): Promise<Discussions[]> => {
			const res = await fetch(
				`${BACKEND_URL}/market/data/market-discussions?marketId=${marketId}`,
				{
					method: "GET",
					credentials: "include",
				},
			);
			const response = await res.json();

			if (!res.ok) {
				throw new Error(response.message);
			}

			return response.discussions;
		},
	});

	return {
		data: discussionMarketQuery.data,
		isLoading:
			discussionMarketQuery.isLoading || discussionMarketQuery.isPending,
		isError: discussionMarketQuery.isError,
		errorMesage: discussionMarketQuery.error,
	};
};
