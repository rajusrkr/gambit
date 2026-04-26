import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MARKET_CATEGORY, MARKET_STATUS } from "../types";

interface MarketFilters {
	marketCategory: MARKET_CATEGORY;
	marketStatus: MARKET_STATUS;

	setMarketCategory: ({ category }: { category: MARKET_CATEGORY }) => void;
	setMarketStatus: ({ status }: { status: MARKET_STATUS }) => void;
}

export const useMarketFilters = create(
	persist<MarketFilters>(
		(set) => ({
			marketCategory: "all",
			marketStatus: "all",
			setMarketCategory: ({ category }) => {
				set({ marketCategory: category });
			},
			setMarketStatus: ({ status }) => {
				set({ marketStatus: status });
			},
		}),
		{ name: "adminMarketFilter" },
	),
);
