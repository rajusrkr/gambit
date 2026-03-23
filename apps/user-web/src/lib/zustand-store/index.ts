import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface AppStates {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;

  markets: Market[];

  marketById: MarketById;

  marketPrices: {
    id: string;
    time: string;
    prices: {
      price: string;
      title: string;
      volume: number;
    }[];
  }[];

  latestPrices: {
    id: string;
    prices: {
      price: string;
      title: string;
      volume: number;
    }[];
  }[];

  // Functions
  setMarkets: ({ markets }: { markets: Market[] }) => void;
  setMarketById: ({ marketById }: { marketById: MarketById }) => void;
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
    }),
    { name: "app-store" },
  ),
);

export { useAppStore };
