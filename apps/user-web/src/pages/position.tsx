import { IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { BACKEND_URL } from "@/lib/utils";
import { useAppStore } from "@/lib/zustand-store";

interface Position {
	positionId: string;
	marketTitle: string;
	outcomeTitle: string;
	qty: number;
	avgPrice: string;
	marketId: string;
}

interface PositionFetchRes {
	success: boolean;
	message: string;
	positions: Position[];
}

interface LatestPrice {
	marketId: string;
	prices: {
		price: string;
		title: string;
		volume: number;
	}[];
}

interface LatestPriceRes {
	success: boolean;
	message: string;
	latestPrices: LatestPrice[];
}

export default function Position() {
	const { setAllPositins, allPositions, setLatestPrice } = useAppStore();

	const fetchAllPositions = async (): Promise<Position[]> => {
		const res = await fetch(`${BACKEND_URL}/user/position/get-all`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const response = await res.json();

		const data = response as PositionFetchRes;

		if (!data.success) {
			setAllPositins({ allPositions: [] });
			throw new Error("Error in data fetching");
		}
		setAllPositins({ allPositions: data.positions });
		return data.positions;
	};
	const fetchLatestPrices = async (): Promise<LatestPrice[]> => {
		const params = new URLSearchParams();
		allPositions.forEach((position) => {
			params.append("id", position.marketId);
		});

		const res = await fetch(
			`${BACKEND_URL}/user/price/latest-prices?${params}`,
			{
				method: "GET",
				credentials: "include",
			},
		);

		const response = await res.json();

		const data = response as LatestPriceRes;

		if (!data.success) {
			throw new Error("Something went wrong while fetching latest price data");
		}

		setLatestPrice({ latestPrice: data.latestPrices });
		return data.latestPrices;
	};

	const allPositionsQuery = useQuery({
		queryKey: ["fetch-all-position"],
		queryFn: fetchAllPositions,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});
	const latestPricesQuery = useQuery({
		queryKey: ["fetch-latest-prices"],
		queryFn: fetchLatestPrices,
	});

	const isLoadingAnything =
		allPositionsQuery.isLoading || latestPricesQuery.isLoading;

	if (isLoadingAnything) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<span className="animate-spin">
					<IconLoader2 />
				</span>
			</div>
		);
	}

	return (
		<div>
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>All positions</CardTitle>
					<CardDescription>
						All positions taken by you will appear here
					</CardDescription>
				</CardHeader>

				<CardContent>
					{allPositions.length !== 0 ? (
						<div className="space-y-2">
							{allPositions.map((position, i) => (
								<Dialog key={position.positionId}>
									<DialogTrigger className="w-full">
										<Item
											className="w-full flex justify-between hover:cursor-pointer hover:bg-accent"
											variant={"outline"}
										>
											<div className="text-left">
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`QTY: ${position.qty}`}
												</p>
												<p className="font-semibold">
													{`Market title: ${position.marketTitle}`}
												</p>
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`Selected outcome: ${position.outcomeTitle}`}
												</p>
											</div>

											<div className="sm:text-right text-left">
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`Avg Price: ${Math.floor(Number(position.avgPrice) * 100) / 100}`}
												</p>
												<p className="font-semibold">{`PNL: 200.30`}</p>
												<p className="space-x-2 text-xs dark:text-gray-400 text-gray-500">
													<span>Status: Open</span>
													<span>LTP: 21.50</span>
												</p>
											</div>
										</Item>
									</DialogTrigger>

									<DialogContent>
										<DialogHeader>
											<DialogTitle>Position details</DialogTitle>
										</DialogHeader>

										<div className="max-h-[50vh] no-scrollbar overflow-y-auto -mx-4 px-4">
											<Item variant={"outline"}>
												<ItemContent>
													<ItemTitle>
														<p className="font-semibold">
															Market: {allPositions[i].marketTitle}
														</p>
													</ItemTitle>

													<div className="text-gray-400">
														<p>
															{`Selected outcome: ${allPositions[i].outcomeTitle}`}
														</p>
														<p>
															Avg Price:{" "}
															{Math.floor(
																Number(allPositions[i].avgPrice) * 100,
															) / 100}
														</p>
														<p>QTY: {allPositions[i].qty}</p>
													</div>
													<div>
														<p className="font-semibold">PNL: 200.52</p>
													</div>
												</ItemContent>
											</Item>
										</div>
										<DialogFooter>
											<Input placeholder="Quantity" type="number" />
											<Button variant={"destructive"} className="w-24">
												Sell
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							))}
						</div>
					) : (
						<div className="flex justify-center h-70 items-center">
							<p>No positions yet</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
