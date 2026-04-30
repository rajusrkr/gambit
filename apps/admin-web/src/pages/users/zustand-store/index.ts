import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Filters = "none" | "latest" | "oldest" | "highest" | "lowest";
export type FilterLabel = "Registered" | "Balance" | "Profit" | "Turnover";

interface FilterStates {
	queryFilter: { label: string; value: string };
	setFilter: ({ label, value }: { label: FilterLabel; value: Filters }) => void;
}

export const useMarketFilterStore = create(
	persist<FilterStates>(
		(set) => ({
			queryFilter: { label: "", value: "" },
			setFilter: ({ label, value }) => {
				set({ queryFilter: { label, value } });
			},
		}),
		{ name: "userQuery-filters" },
	),
);
