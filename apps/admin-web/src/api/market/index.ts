export interface MarketData {
	marketId: string;
	marketTitle: string;
	outcomes: {
		title: string;
		price: string;
		volume: number;
	}[];
	marketStatus: string;
	marketCategory: string;
}
const deleteMarket = async ({
	marketId,
}: {
	marketId: string;
}): Promise<string> => {
	const res = await fetch(
		`http://localhost:3333/api/v0/market/delete?marketId=${marketId}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		},
	);

	const response = await res.json();

	if (!response.success) {
		throw new Error(response.message);
	}

	return response.message;
};
const fetchMarket = async ({
	limit,
}: {
	limit: number;
}): Promise<MarketData[]> => {
	const res = await fetch(
		`http://localhost:3333/api/v0/market/data/get-markets?limit=${limit}`,
		{ method: "GET" },
	);

	const response = await res.json();

	if (!response.success) {
		throw new Error(response.message);
	}

	return response.markets;
};

export { deleteMarket, fetchMarket };
