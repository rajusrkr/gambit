import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/config/constants";
import type { OrderHistoy } from "../types";

export const useOrder = ({ marketId }: { marketId: string }) => {
	const orderQuery = useQuery({
		queryKey: ["order", marketId],
		queryFn: async (): Promise<OrderHistoy[]> => {
			const res = await fetch(
				`${BACKEND_URL}/market/data/order-history?marketId=${marketId}`,
				{ method: "GET", credentials: "include" },
			);

			const response = await res.json();

			if (!res.ok) {
				throw new Error(response.message);
			}
			
			return response.orders;
		},
	});

	return {
		isLoading: orderQuery.isLoading,
		isError: orderQuery.isError,
		errorMessage: orderQuery.error,
		data: orderQuery.data,
	};
};
