import { create } from "zustand";
import { persist } from "zustand/middleware";

export type tabs = "buy" | "sell";

interface Market {
	id: string;
	title: string;
	outcomes: {
		title: string;
		price: string;
		volume: number;
	}[];
	marketStatus: string;
	marketCategory: string;
}

interface MarketById {
	id: string;
	title: string;
	description: string;
	settlementRules: string;
	marketType: string;
	closing: number;
	marketStatus: string;
	outcomes: {
		outcomeTitle: string;
		price: string;
		volume: number;
	}[];
}

export interface Position {
	positionId: string;
	marketId: string;
	outcome: string;
	avgPrice: string;
	positionQty: number;
	tradeCost: string;
}

export interface LatestPrice {
	marketId: string;
	prices: {
		price: string;
		title: string;
		volume: number;
	}[];
}

interface AppStates {
	isLoading: boolean;
	isError: boolean;
	errorMessage: string | null;

	markets: Market[];

	marketById: MarketById;
	positions: Position[];

	marketPrices: {
		id: string;
		time: string;
		prices: {
			price: string;
			title: string;
			volume: number;
		}[];
	}[];

	latestPrices: LatestPrice[];
	defaultTab: tabs;
	selectedPosition: string;

	// Functions
	setMarkets: ({ markets }: { markets: Market[] }) => void;
	setMarketById: ({ marketById }: { marketById: MarketById }) => void;
	setPosition: ({ positions }: { positions: Position[] }) => void;
	setLatestPrice: ({ latestPrice }: { latestPrice: LatestPrice[] }) => void;
	setDefaultTab: ({ tab }: { tab: tabs }) => void;
	setSelectedPosition: ({
		selectedPosition,
	}: {
		selectedPosition: string;
	}) => void;
}

const useAppStore = create(
	persist<AppStates>(
		(set) => ({
			isLoading: false,
			isError: false,
			errorMessage: "",
			marketById: {
				id: "",
				title: "",
				settlementRules: "",
				marketType: "",
				closing: 0,
				description: "",
				outcomes: [],
				marketStatus: "",
			},
			marketPrices: [],
			markets: [],

			latestPrices: [],

			positions: [],
			defaultTab: "buy",
			selectedPosition: "",
			setMarkets: ({ markets }) => {
				set((prev) => {
					const existingMarkets = new Set(
						prev.markets.map((market) => market.id),
					);
					const uniqueMarkets = markets.filter(
						(market) => !existingMarkets.has(market.id),
					);

					return { markets: [...prev.markets, ...uniqueMarkets] };
				});
			},
			setMarketById: ({ marketById }) => {
				set({ marketById });
			},

			setPosition: ({ positions }) => {
				set({ positions });
			},
			setLatestPrice: ({ latestPrice }) => {
				set({ latestPrices: latestPrice });
			},
			setDefaultTab: ({ tab }) => {
				set({ defaultTab: tab });
			},
			setSelectedPosition: ({ selectedPosition }) => {
				set({ selectedPosition });
			},
		}),
		{ name: "app-store" },
	),
);

export { useAppStore };
