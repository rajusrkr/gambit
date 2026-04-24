import { useQuery } from "@tanstack/react-query";
import type { Time } from "lightweight-charts";
import { useTheme } from "@/components/theme-provider";
import { BACKEND_URL } from "@/config/constants";
import type { PriceHistory } from "../types";

const lineColors = {
  dark: [
    "#ef4444",
    "#f97316",
    "#84cc16",
    "#3b82f6",
    "#64748b",
    "#581c87",
    "#831843",
    "#365314",
  ],
  light: [
    "#dc2626",
    "#ea580c",
    "#65a30d",
    "#2563eb",
    "#475569",
    "#3b0764",
    "#500724",
    "#1a2e05",
  ],
};

export const usePriceHistory = ({ marketId }: { marketId: string }) => {
  const { theme } = useTheme();
  const priceHistoryQuery = useQuery({
    queryKey: ["price-history", marketId, theme],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_URL}/market/data/price-history?marketId=${marketId}`,
        {
          credentials: "include",
        },
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          `${response.message}. Hence unable to show chart data.`,
        );
      }

      const priceHistory = response.priceHistory as PriceHistory[];

      if (priceHistory.length === 0) {
        throw new Error(`${response.message}.`);
      }

      // Clean data for duplicate timestamp
      const sanitizedData: PriceHistory[] = [];
      const seenTimeStamp = new Set<number>();

      priceHistory.forEach((price) => {
        const unixTime = Math.floor(new Date(price.time).getTime() / 1000);

        if (!seenTimeStamp.has(unixTime)) {
          seenTimeStamp.add(unixTime);
          sanitizedData.push(price);
        }
      });

      const groupedData = sanitizedData.reduce(
        (
          acc: Record<
            string,
            {
              outcomeTitle: string;
              color: string;
              prices: { value: number; time: Time }[];
            }
          >,
          item,
        ) => {
          item.prices.forEach((price, i) => {
            if (!acc[price.title]) {
              acc[price.title] = {
                outcomeTitle: price.title,
                color:
                  theme === "dark" ? lineColors.dark[i] : lineColors.light[i],
                prices: [],
              };
            }
            acc[price.title].prices.push({
              value: Math.floor(Number(price.price) * 100) / 100,
              time: Math.floor(new Date(item.time).getTime() / 1000) as Time,
            });
          });
          return acc;
        },
        {},
      );

      const chartData = Object.values(groupedData);
      return chartData;
    },
    retry: 1,
  });
  return {
    isLoading: priceHistoryQuery.isLoading,
    isError: priceHistoryQuery.isError,
    errorMessage: priceHistoryQuery.error,
    data: priceHistoryQuery.data,
  };
};
