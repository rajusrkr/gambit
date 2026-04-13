import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteMarket, fetchMarket } from "@/api/market";

export const useMarket = () => {
	const marketQuery = useQuery({
		queryKey: ["fetch-markets"],
		queryFn: () => fetchMarket({ limit: 3 }),
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	return { data: marketQuery.data, isLoading: marketQuery.isPending };
};

export const deleteMarketMutation = ({ marketId }: { marketId: string }) => {
	const marketDeleteMutation = useMutation({
		mutationKey: ["delete-market"],
		mutationFn: () => deleteMarket({ marketId }),
		onSuccess: (data) => {
			console.log(data);
		},
	});

	return {
		isLoading: marketDeleteMutation.isPending,
		data: marketDeleteMutation.data,
		mutate: marketDeleteMutation.mutate()
	};
};
