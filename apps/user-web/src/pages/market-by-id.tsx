import {
	IconBook2,
	IconCircleX,
	IconLoader2,
	IconSend,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Time } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import type { ChartData } from "@/components/MarketPriceChart";
import MarketPriceChart from "@/components/MarketPriceChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useWebsocket } from "@/components/web-socket-provider";
import { calculatePnl } from "@/lib/calculate-pnl";
import { BACKEND_URL } from "@/lib/utils";
import { useAppStore } from "@/lib/zustand-store";
import { useTheme } from "@/components/theme-provider";

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

interface FetchMarketByIdRes {
	success: boolean;
	message: string;
	marketData: MarketById;
}

interface OrderData {
	marketId: string;
	orderType: "buy" | "sell";
	orderQty: number;
	selectedOutcome: string;
}

interface SellOrderData {
	positionId: string;
	marketId: string;
	orderType: "buy" | "sell";
	orderQty: number;
	selectedOutcome: string;
}

interface PositionById {
	positionId: string;
	marketId: string;
	outcome: string;
	avgPrice: string;
	positionQty: number;
	tradeCost: string;

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

interface PositionByIdRes {
	success: boolean;
	message: string;
	positions: PositionById[];
}

interface FetchOrderHistoy {
	outcome: string;
	qty: number;
	avgPrice: string;
	orderedBy: string;
	orderId: string;
}

interface FetchOrderHistoyRes {
	success: boolean;
	message: string;
	orders: FetchOrderHistoy[];
}

const tabs = [
	{ value: "chart", title: "Chart" },
	{ value: "overview", title: "Overview" },
	{ value: "discussions", title: "Discussions" },
	{ value: "history", title: "History" },
];
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
interface FetchedPriceData {
	prices: {
		price: string;
		title: string;
		volume: number;
	}[];
	time: string;
}

// ==================================
// Sub components
// ==================================
// Matket details, title, type etc
function MarketMetaData({
	title,
	closing,
	type,
}: {
	title: string;
	type: string;
	closing: number;
}) {
	return (
		<div>
			<h1 className="text-2xl font-semibold">{title}</h1>
			<div className="items-center flex gap-2">
				<Badge>
					<span className="capitalize font-semibold">{type}</span>
				</Badge>
				<span className="text-xs text-gray-400">
					Closes: {new Date(closing * 1000).toDateString()}
				</span>
			</div>
		</div>
	);
}
// Chart tab
function ChartTabContent() {
	const { theme } = useTheme();

	const marketId = useParams().id;

	const fetchPriceHistory = async (): Promise<ChartData[]> => {
		const res = await fetch(
			`${BACKEND_URL}/user/price/history?marketId=${marketId}`,
			{
				credentials: "include",
			},
		);

		const data = await res.json();
		const priceHistory = data.priceHistory as FetchedPriceData[];

		const groupedData = priceHistory.reduce(
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
	};

	const { data, isLoading } = useQuery({
		queryKey: ["fetch-price_history"],
		queryFn: fetchPriceHistory,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
	});

	if (isLoading) {
		return (
			<div className="h-96 flex justify-center items-center">
				<span className="animate-spin">
					<IconLoader2 />
				</span>
			</div>
		);
	}

	if (!data) {
		throw new Error("Unable to fetch chart price data");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Chart</CardTitle>
				<CardDescription>
					Showing all prices in a single chart. Take mouse on chart to see data
				</CardDescription>
			</CardHeader>
			<CardContent>
				<MarketPriceChart chartData={data} />
			</CardContent>
		</Card>
	);
}
// Overview tab
function OverviewTabContent({
	outcomes,
}: {
	outcomes: {
		outcomeTitle: string;
		price: string;
		volume: number;
	}[];
}) {
	const marketId = useParams().id;
	const { positions, latestPrices, setDefaultTab, setSelectedPosition } =
		useAppStore();

	return (
		<Card className="px-4">
			<CardHeader>
				<CardTitle>Betting options</CardTitle>
				<CardDescription>All betting options listed below</CardDescription>
			</CardHeader>

			<CardContent>
				<div>
					{outcomes.map((outcome) => (
						<div key={outcome.outcomeTitle} className="mb-4">
							<p className="text-lg font-semibold mb-1 flex items-center gap-4">
								<span>{outcome.outcomeTitle}</span>
								<span className="text-gray-500 space-x-2">
									<Badge variant={"outline"} className="select-none">
										Volume: {outcome.volume}
									</Badge>
									{positions.find(
										(position) => position.outcome === outcome.outcomeTitle,
									) && (
										<Badge className="select-none">
											<span className="font-semibold">Position</span>
										</Badge>
									)}

									{positions.find(
										(position) => position.outcome === outcome.outcomeTitle,
									) && (
										<Badge
											onClick={() => {
												setDefaultTab({ tab: "sell" });
												setSelectedPosition({
													selectedPosition: outcome.outcomeTitle,
												});
											}}
											className={`${
												calculatePnl({
													// biome-ignore lint/style/noNonNullAssertion: <market id is mandatory to render this page component>
													marketId: marketId!,
													latestPrices: latestPrices,
													outcomeTitle: outcome.outcomeTitle,
													positions: positions,
												}) > 0 && "bg-green-700"
											} select-none hover:cursor-pointer`}
											variant={
												calculatePnl({
													// biome-ignore lint/style/noNonNullAssertion: <market id is mandatory to render this page component>
													marketId: marketId!,
													latestPrices: latestPrices,
													outcomeTitle: outcome.outcomeTitle,
													positions: positions,
												}) < 0
													? "destructive"
													: "default"
											}
										>
											<span className="font-semibold">
												PNL:{" "}
												{String(
													calculatePnl({
														// biome-ignore lint/style/noNonNullAssertion: <market id is mandatory to render this page component>
														marketId: marketId!,
														latestPrices: latestPrices,
														outcomeTitle: outcome.outcomeTitle,
														positions: positions,
													}),
												)}
											</span>
										</Badge>
									)}
								</span>
							</p>

							<div className="flex items-center gap-3">
								<div className="flex-1">
									<Progress
										value={Number(Number(outcome.price).toFixed(2)) * 100}
									/>
								</div>

								<div className="flex gap-2 whitespace-nowrap text-sm font-medium">
									<span>
										<Badge variant={"outline"}>
											{Number(Math.floor(Number(outcome.price) * 100))}%
										</Badge>
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
// Discussions tab
function DiscussionsTabContent() {
	const [message, setMessage] = useState("");

	const { setDiscussion, discussions } = useAppStore();

	const scrollRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <discussions dependency is needed to update container position>
	useEffect(() => {
		const container = scrollRef.current;

		if (container) {
			/**
			 * Total height of the message, how much scrolled from the top, what is client height
			 *
			 *
			 * Subtract three and get the rest of the scrollheight
			 *
			 * if scroll height is less than 500 that means the user in the bottom
			 */
			const distanceToBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight;
			const isNearBottom = distanceToBottom < 500;

			if (isNearBottom) {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: "smooth",
				});
			}
		}
	}, [discussions]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Discuss about this event</CardTitle>
				<CardDescription>
					Discuss about this event with your fellow traders
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div
					ref={scrollRef}
					className="max-h-96 overflow-y-auto no-scrollbar mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] pb-10"
				>
					{discussions.map((discussion) => (
						<Item
							key={discussion.id}
							className={`${discussion.user === "Jason" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`${discussion.user === "Jason" ? "bg-primary" : "bg-accent"} p-2 rounded-sm`}
							>
								<ItemTitle
									className={`${discussion.user === "Jason" && "dark:text-white text-white"}`}
								>
									{discussion.message}
								</ItemTitle>
								<ItemDescription
									className={`${discussion.user === "Jason" && "dark:text-gray-400 text-gray-300"}`}
								>
									{discussion.user === "Jason" ? "You" : discussion.user}
								</ItemDescription>
							</div>
						</Item>
					))}
				</div>
				<div>
					<div className="flex justify-between">
						<Textarea
							placeholder="Message"
							onChange={(e) => {
								setMessage(e.target.value);
							}}
						/>
						<Button
							className="h-16 w-20 space-x-2"
							onClick={() => {
								setDiscussion({
									discussion: { id: "30", message: message, user: "Jason" },
								});
							}}
						>
							<IconSend className="size-6" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
// History tab
function HistoryTabContent() {
	const { orders } = useAppStore();

	return (
		<div>
			<Card className="">
				<CardHeader>
					<CardTitle>Order history</CardTitle>
					<CardDescription>
						Order history of all user's for this market
					</CardDescription>
				</CardHeader>

				<CardContent>
					{orders.length === 0 ? (
						<Item variant={"outline"}>
							<ItemMedia>
								<IconCircleX />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>No order history available</ItemTitle>
								<ItemDescription>
									No order history available for this market
								</ItemDescription>
							</ItemContent>
						</Item>
					) : (
						<div className="space-y-1 max-h-96 overflow-y-auto no-scrollbar mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] pb-10">
							{orders.map((order) => (
								<Item key={order.orderId} variant={"outline"}>
									<ItemMedia>
										<IconBook2 />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Outcome: {order.outcome}</ItemTitle>
										<ItemDescription className="flex gap-2">
											<p>QTY: {order.qty}</p>
											<p>
												Avg Price:{" "}
												{Math.floor(Number(order.avgPrice) * 100) / 100}
											</p>
											<p>Ordered By: {order.orderedBy}</p>
										</ItemDescription>
									</ItemContent>
								</Item>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
// Main card holding all four tab data
function DataCard({
	outcomes,
}: {
	outcomes: {
		outcomeTitle: string;
		price: string;
		volume: number;
	}[];
}) {
	return (
		<Card className="px-4 max-w-4xl">
			<Tabs defaultValue="chart">
				<TabsList variant={"line"}>
					{tabs.map((tab) => (
						<TabsTrigger value={tab.value} key={tab.title}>
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Tab contents */}
				<TabsContent value="chart">
					<ChartTabContent />
				</TabsContent>
				<TabsContent value="overview">
					<OverviewTabContent outcomes={outcomes} />
				</TabsContent>
				<TabsContent value="discussions">
					<DiscussionsTabContent />
				</TabsContent>
				<TabsContent value="history">
					<HistoryTabContent />
				</TabsContent>
			</Tabs>
		</Card>
	);
}
// Descriptions and settlement rules
function MarketDescriptionAndSettlementRules({
	description,
	settlementRules,
}: {
	description: string;
	settlementRules: string;
}) {
	return (
		<div className="pb-2">
			<h2 className="font-semibold">Description</h2>
			<p className="text-sm text-gray-500 max-w-4xl">{description}</p>
			<h2 className="font-semibold mt-2">Settlement Rules</h2>
			<p className="text-sm text-gray-500 max-w-4xl">{settlementRules}</p>
		</div>
	);
}
// Order card
function OrderCard({
	outcomes,
}: {
	outcomes: {
		outcomeTitle: string;
		price: string;
		volume: number;
	}[];
}) {
	const [selectedButton, setSelectedButton] = useState<null | number>(null);
	const [selectOutcome, setSelectedOutcome] = useState<null | string>(null);
	const [quantity, setQuantity] = useState<number>(0);

	const {
		positions,
		latestPrices,
		defaultTab,
		selectedPosition,
		setSelectedPosition,
		setDefaultTab,
	} = useAppStore();

	const buyOrderDataValidation = z.object({
		marketId: z.string(),
		orderType: z.enum(["buy"]),
		orderQty: z.number().min(1, "Minimum order qty is 1"),
		selectedOutcome: z.string(),
	});

	const sellOrderDataValidation = z.object({
		positionId: z.string(),
		marketId: z.string(),
		orderType: z.enum(["sell"]),
		orderQty: z.number().min(1, "Minimum order qty is 1"),
		selectedOutcome: z.string(),
	});

	const marketId = useParams().id;

	const placeOrder = async ({
		orderData,
	}: {
		orderData: OrderData;
	}): Promise<void> => {
		const validateData = buyOrderDataValidation.safeParse(orderData);

		if (!validateData.success) {
			const errorMessage = validateData.error.issues[0].message;
			toast.error(errorMessage, { richColors: true, position: "top-right" });
			throw new Error(errorMessage);
		}

		const res = await fetch(`${BACKEND_URL}/user/order/buy`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(validateData.data),
		});

		const response = await res.json();

		if (!response.success) {
			toast.error(response.message, {
				richColors: true,
				position: "top-right",
			});
			throw new Error(response.message);
		}
		toast.success(response.message, {
			richColors: true,
			position: "top-right",
		});
	};

	const placeSellOrder = async ({
		sellOrderData,
	}: {
		sellOrderData: SellOrderData;
	}): Promise<void> => {
		const validateData = sellOrderDataValidation.safeParse(sellOrderData);

		console.log(validateData);

		if (!validateData.success) {
			const errorMessage = validateData.error.issues[0].message;
			toast.error(errorMessage, { richColors: true, position: "top-right" });
			throw new Error(errorMessage);
		}

		const res = await fetch(`${BACKEND_URL}/user/order/sell`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(validateData.data),
		});

		const response = await res.json();

		if (!response.success) {
			toast.error(response.message, {
				richColors: true,
				position: "top-right",
			});
			throw new Error(response.message);
		}
		toast.success(response.message, {
			richColors: true,
			position: "top-right",
		});
	};

	const { mutate } = useMutation({
		mutationFn: () =>
			placeOrder({
				orderData: {
					// biome-ignore lint/style/noNonNullAssertion: <market id is required to render this page component>
					marketId: marketId!,
					orderQty: quantity,
					orderType: defaultTab,
					selectedOutcome:
						// biome-ignore lint/style/noNonNullAssertion: <selected ouctome will be verified in the mutation func>
						defaultTab === "buy" ? selectOutcome! : selectedPosition,
				},
			}),
	});

	const sellOrder = useMutation({
		mutationFn: () =>
			placeSellOrder({
				sellOrderData: {
					// biome-ignore lint/style/noNonNullAssertion: <selected ouctome will be verified in the mutation func>
					marketId: marketId!,
					orderQty: quantity,
					orderType: "sell",
					selectedOutcome: selectedPosition,
					positionId: positions.filter(
						(position) => position.outcome === selectedPosition,
					)[0].positionId,
				},
			}),
	});

	useEffect(() => {
		if (positions.length === 0) {
			setDefaultTab({ tab: "buy" });
		}
	}, [positions, setDefaultTab]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Place order</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<Tabs
					defaultValue={defaultTab}
					value={defaultTab}
					onValueChange={(e) => {
						setDefaultTab({ tab: e as "buy" | "sell" });
					}}
				>
					<TabsList variant={"line"}>
						<TabsTrigger value="buy">Buy</TabsTrigger>
						{positions.length !== 0 && (
							<TabsTrigger value="sell">Positions</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="buy">
						<div className="flex flex-col space-y-1">
							{outcomes.map((outcome, i) => (
								<Button
									className={`${i === selectedButton && "bg-accent-foreground text-accent 			hover:bg-accent-foreground"}`}
									key={outcome.outcomeTitle}
									variant={i === selectedButton ? "secondary" : "outline"}
									onClick={() => {
										setSelectedButton(i);
										setSelectedOutcome(outcome.outcomeTitle);
									}}
								>
									{outcome.outcomeTitle}
								</Button>
							))}
						</div>
						<div className="py-2">
							<Label htmlFor="order-quantity" className="mb-1">
								Quantity
							</Label>
							<Input
								type="number"
								required
								placeholder="Enter qty. eg: 100"
								defaultValue={quantity}
								onChange={(e) => {
									setQuantity(Number(e.target.value));
								}}
							/>
						</div>
						<div>
							<Button
								className="w-full"
								disabled={quantity === 0 || !selectOutcome}
								onClick={() => {
									mutate();
								}}
							>
								Buy
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="sell">
						<div className="flex flex-col space-y-1">
							{positions.map((position) => (
								<Item
									key={position.outcome}
									variant={"outline"}
									className={`${selectedPosition === position.outcome && "bg-foreground text-background"} hover:cursor-pointer`}
									onClick={() => {
										setSelectedPosition({ selectedPosition: position.outcome });
										setSelectedOutcome(position.outcome);
									}}
								>
									<ItemContent>
										<ItemTitle>{position.outcome}</ItemTitle>
										<ItemDescription>
											<span>
												PNL:{" "}
												{calculatePnl({
													// biome-ignore lint/style/noNonNullAssertion: <market id is mandatory to render this page component>
													marketId: marketId!,
													latestPrices: latestPrices,
													outcomeTitle: position.outcome,
													positions: positions,
												})}
											</span>
											<span className="flex gap-2">
												<span>QTY: {position.positionQty}</span>
												<span>
													Avg Price:{" "}
													{Math.floor(Number(position.avgPrice) * 100) / 100}
												</span>
											</span>
										</ItemDescription>
									</ItemContent>
								</Item>
							))}
						</div>
						<div className="py-2">
							<Label htmlFor="order-quantity" className="mb-1">
								Quantity
							</Label>
							<Input
								disabled={selectedPosition.length === 0}
								type="number"
								required
								placeholder="Enter qty. eg: 100"
								defaultValue={quantity}
								onChange={(e) => {
									setQuantity(Number(e.target.value));
								}}
							/>
						</div>
						<div>
							<Button
								className="w-full"
								variant={"destructive"}
								disabled={quantity === 0}
								onClick={() => {
									sellOrder.mutate();
								}}
							>
								Sell
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

export default function MarketById() {
	const marketId = useParams().id;

	const { sendMessage } = useWebsocket();
	const {
		setMarketById,
		marketById,
		setPosition,
		setLatestPrice,
		setOrderHistory,
	} = useAppStore();
	const fetchMarketById = async (): Promise<FetchMarketByIdRes> => {
		const res = await fetch(
			`${BACKEND_URL}/market/get-market-by-id?marketId=${marketId}`,
		);
		const response = await res.json();
		if (!response.success) {
			throw new Error(response.message);
		}

		const data = response as FetchMarketByIdRes;
		if (data.success) {
			sendMessage({
				type: "TICKER_UPDATE",
				message: "Want to sub for ticker update",
				// biome-ignore lint/style/noNonNullAssertion: <market id is a  required parameter  for this page component to render>
				payload: { pageRef: "market:id", roomsToSub: [marketId!] },
			});

			setMarketById({ marketById: data.marketData });
		}

		return data;
	};

	const { isLoading } = useQuery({
		queryKey: ["market-by-id"],
		queryFn: fetchMarketById,
	});

	const fetchPositionById = async () => {
		const res = await fetch(
			`${BACKEND_URL}/user/position/get?marketId=${marketId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			},
		);

		const response = await res.json();

		const data = response as PositionByIdRes;
		if (data.success) {
			setPosition({ positions: data.positions });
		} else {
			setPosition({ positions: [] });
		}
	};

	const fetchPositions = useQuery({
		queryFn: fetchPositionById,
		queryKey: ["positionById"],
	});

	const fetchLatestPrice = async () => {
		const params = new URLSearchParams();
		// biome-ignore lint/style/noNonNullAssertion: <market id is mandatory to render this page>
		params.append("id", marketId!);

		const res = await fetch(
			`${BACKEND_URL}/user/price/latest-prices?${params}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			},
		);

		const response = await res.json();
		const data = response as LatestPriceRes;

		if (data.success) {
			setLatestPrice({ latestPrice: data.latestPrices });
		} else {
			setLatestPrice({ latestPrice: [] });
		}
	};

	const fetchLatestPrices = useQuery({
		queryKey: ["fetch-latest-price"],
		queryFn: fetchLatestPrice,
	});

	const fetchOrders = async () => {
		try {
			const res = await fetch(
				`${BACKEND_URL}/order/get-order-history?marketId=${marketId}`,
			);

			const response = await res.json();
			const data = response as FetchOrderHistoyRes;

			if (data.success) {
				setOrderHistory({ orders: data.orders });
			} else {
				setOrderHistory({ orders: [] });
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchOrdersQuery = useQuery({
		queryKey: ["fetchOrders"],
		queryFn: fetchOrders,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<IconLoader2 size={25} className="animate-spin" />
			</div>
		);
	}

	if (fetchPositions.isLoading) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<IconLoader2 size={25} className="animate-spin" />
			</div>
		);
	}

	if (fetchLatestPrices.isLoading) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<IconLoader2 size={25} className="animate-spin" />
			</div>
		);
	}

	if (fetchOrdersQuery.isLoading) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<IconLoader2 size={25} className="animate-spin" />
			</div>
		);
	}

	const { title, description, settlementRules, closing, marketType, outcomes } =
		marketById;

	return (
		<div>
			{marketById && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left side */}
					<div className="space-y-2 lg:col-span-2">
						<MarketMetaData title={title} closing={closing} type={marketType} />
						<DataCard outcomes={outcomes} />
						<MarketDescriptionAndSettlementRules
							description={description}
							settlementRules={settlementRules}
						/>
					</div>
					{/* Right side */}
					<div className="relative">
						<div className="sticky top-20 self-start">
							<OrderCard outcomes={outcomes} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
