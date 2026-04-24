import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/config/constants";
import type { LatestPrice } from "../types";

// TODO: call the api function from markets/api where i have written the fetch latest price function
export const useLatestPrice = ({ marketId }: { marketId: string }) => {
  const latestPriceQuery = useQuery({
    queryKey: ["latest-price", marketId],
    queryFn: async ({ signal }): Promise<LatestPrice[]> => {
      const params = new URLSearchParams();
      params.append("id", marketId);

      const res = await fetch(
        `${BACKEND_URL}/market/data/get-latest-price?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal,
        },
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      return response.latestPrice;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return {
    isLoading: latestPriceQuery.isLoading,
    isError: latestPriceQuery.isError,
    errorMessage: latestPriceQuery.error,
    data: latestPriceQuery.data,
  };
};
