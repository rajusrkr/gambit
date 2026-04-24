import { useQuery } from "@tanstack/react-query";
import { useWebsocket } from "@/components/web-socket-provider";
import { BACKEND_URL } from "@/config/constants";
import type { MarketById } from "../types";

export const useMarketById = ({ marketId }: { marketId: string }) => {
	const { sendMessage } = useWebsocket();

	const marketByIdQuery = useQuery({
		queryKey: ["market-by-id"],
		queryFn: async (): Promise<MarketById> => {
			const res = await fetch(
				`${BACKEND_URL}/market/data/market-by-id?marketId=${marketId}`,
				{ method: "GET", credentials: "include" },
			);
			const response = await res.json();
			if (!response.success) {
				throw new Error(response.message);
			}

			sendMessage({
				type: "TICKER_UPDATE",
				message: "Want to sub for ticker update",
				payload: { pageRef: "market:id", roomsToSub: [marketId] },
			});

			return response.marketById;
		},
	});

	return {
		isLoading: marketByIdQuery.isLoading || marketByIdQuery.isPending,
		isError: marketByIdQuery.isError,
		errorMessage: marketByIdQuery.error,
		data: marketByIdQuery.data,
	};
};
