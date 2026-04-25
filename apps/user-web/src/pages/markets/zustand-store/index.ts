import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MARKET_CATEGORY } from "../types";

interface MarketCardsFilter {
	marketCategory: MARKET_CATEGORY;
	setMarketCategory: ({ category }: { category: MARKET_CATEGORY }) => void;
}

export const useMarketCardsFilter = create(
	persist<MarketCardsFilter>(
		(set) => ({
			marketCategory: "all",
			setMarketCategory: ({ category }) => {
				set({ marketCategory: category });
			},
		}),
		{ name: "market-filter" },
	),
);
