import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/config/constants";
import type { PositionByMarketId } from "../types";

export const usePositionByMarketId = ({ marketId }: { marketId: string }) => {
	const positionByMarketIdQuery = useQuery({
		queryKey: ["position-by-market-id", marketId],
		queryFn: async (): Promise<PositionByMarketId[]> => {
			const res = await fetch(
				`${BACKEND_URL}/market/data/position?marketId=${marketId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				},
			);
			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			// const positions = response.positions as PositionByMarketId[];

			// const mapedData = new Map<
			// 	string,
			// 	{
			// 		avgPrice: string;
			// 		outcome: string;
			// 		positionQty: number;
			// 		tradeCost: string;
			// 		positionId: string;
			// 	}[]
			// >();

			// positions.forEach((position) => {
			// 	const uniqueId = position.marketId;

			// 	if (!mapedData.has(uniqueId)) {
			// 		mapedData.set(uniqueId, []);
			// 	}

			// 	mapedData.get(uniqueId)?.push({
			// 		avgPrice: position.avgPrice,
			// 		outcome: position.outcome,
			// 		positionId: position.positionId,
			// 		positionQty: position.positionQty,
			// 		tradeCost: position.tradeCost,
			// 	});
			// });

			// console.log(mapedData);

			return response.positions;
		},
	});

	return {
		isLoading: positionByMarketIdQuery.isLoading,
		isError: positionByMarketIdQuery.isError,
		error: positionByMarketIdQuery.error,
		data: positionByMarketIdQuery.data,
	};
};
