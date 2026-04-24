import { create } from "zustand";
import { persist } from "zustand/middleware";

type DefaltTab = "buy" | "sell";

interface MarketByidStoreStates {
	defaultTab: DefaltTab;
	selectedPosition: string;

	setDefaultTab: ({ defaultTab }: { defaultTab: DefaltTab }) => void;
	setSelectedPosition: ({
		selectedPosition,
	}: {
		selectedPosition: string;
	}) => void;
}

const useMarketByIdStore = create(
	persist<MarketByidStoreStates>(
		(set) => ({
			defaultTab: "buy",
			selectedPosition: "",

			setDefaultTab: ({ defaultTab }) => {
				set({ defaultTab });
			},
			setSelectedPosition: ({ selectedPosition }) => {
				set({ selectedPosition });
			},
		}),
		{ name: "market-by-id" },
	),
);

export { useMarketByIdStore };
