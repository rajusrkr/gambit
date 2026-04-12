import { create } from "zustand";
import { persist } from "zustand/middleware";

export type tabs = "buy" | "sell";

interface Discussions {
	id: string;
	message: string;
	user: string;
}

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

interface FetchOrderHistoy {
	outcome: string;
	qty: number;
	avgPrice: string;
	orderedBy: string;
	orderId: string;
}

interface AllPositions {
	positionId: string;
	marketTitle: string;
	outcomeTitle: string;
	qty: number;
	avgPrice: string;
	marketId: string;
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

	discussions: Discussions[];

	latestPrices: LatestPrice[];
	defaultTab: tabs;
	selectedPosition: string;
	orders: FetchOrderHistoy[];
	allPositions: AllPositions[];

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
	setOrderHistory: ({ orders }: { orders: FetchOrderHistoy[] }) => void;
	setDiscussion: ({ discussion }: { discussion: Discussions }) => void;
	setAllPositins: ({ allPositions }: { allPositions: AllPositions[] }) => void;
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
			orders: [],
			discussions: [
				{ user: "Sam", message: "Hey there", id: "1" },
				{
					user: "Sam",
					message: "What do you guys thing where the price will reach?",
					id: "2",
				},
				{ user: "Jason", message: "Man its hard to tell", id: "3" },
				{ user: "Jim", message: "Yeah it's hard to tell", id: "4" },
				{
					user: "Jason",
					message: "Let's see what happens we have a news to come this evening",
					id: "5",
				},
				{ user: "Sam", message: "Yeah let's see what happens", id: "6" },
				{ user: "Sam", message: "Yeah let's see what happens", id: "7" },
				{
					user: "Jason",
					message: "Let's see what happens we have a news to come this evening",
					id: "8",
				},
				{ user: "Sam", message: "Yeah let's see what happens", id: "9" },
			],

			positions: [],
			defaultTab: "buy",
			selectedPosition: "",
			allPositions: [],
			setMarkets: ({ markets }) => {
				console.log("setting data");
				set((prev) => {
					if (prev.markets.length < 10) {
						return { markets: markets };
					}

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
			setOrderHistory: ({ orders }) => {
				set({ orders: orders });
			},
			setDiscussion: ({ discussion }) => {
				set((prev) => ({
					discussions: [...prev.discussions, discussion],
				}));
			},
			setAllPositins: ({ allPositions }) => {
				set({ allPositions });
			},
		}),
		{ name: "app-store" },
	),
);

export { useAppStore };
