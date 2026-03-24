import { IconLoader2 } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebsocket } from "@/components/web-socket-provider";
import { BACKEND_URL } from "@/lib/utils";
import { useAppStore } from "@/lib/zustand-store";

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

interface PositionById {
	positionId: string;
	marketId: string;
	outcome: string;
	totalCost: string;
	avgPrice: string;
	positionQty: number;
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

const tabs = [
	{ value: "chart", title: "Chart" },
	{ value: "overview", title: "Overview" },
	{ value: "discussions", title: "Discussions" },
	{ value: "history", title: "History" },
];
// ==================================
// Sub components
// ==================================
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
			<Badge>
				<span className="capitalize font-semibold">{type}</span>
			</Badge>
			<Badge variant={"link"}>
				<span>Closes: {new Date(closing * 1000).toDateString()}</span>
			</Badge>
		</div>
	);
}
function ChartTabContent() {
	return <div>chart tab content</div>;
}
function OverviewTabContent({
	outcomes,
}: {
	outcomes: {
		outcomeTitle: string;
		price: string;
		volume: number;
	}[];
}) {
	const { positions } = useAppStore();

	return (
		<Card className="px-4">
			<div>
				<p className="font-semibold text-xl">Betting options</p>
			</div>

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
									<Badge className="bg-green-700 select-none">Position</Badge>
								)}

								{positions.find(
									(position) => position.outcome === outcome.outcomeTitle,
								) && (
									<Badge className="select-none hover:cursor-pointer">
										QTY:
										{positions[
											positions.findIndex(
												(position) => position.outcome === outcome.outcomeTitle,
											)
										].positionQty * 100}
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
										{Number(Number(outcome.price).toFixed(2)) * 100}%
									</Badge>
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
function DiscussionsTabContent() {
	return <Card className="px-4">DiscussionsTabContent</Card>;
}
function HistoryTabContent() {
	return <Card className="px-4">HistoryTabContent</Card>;
}

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
	const [currentTab, setCurrentTab] = useState<"buy" | "sell">("buy");

	const orderDataValidation = z.object({
		marketId: z.string(),
		orderType: z.enum(["buy", "sell"]),
		orderQty: z.number().min(1, "Minimum order qty is 1"),
		selectedOutcome: z.string(),
	});

	const marketId = useParams().id;

	const placeOrder = async ({
		orderData,
	}: {
		orderData: OrderData;
	}): Promise<void> => {
		const validateData = orderDataValidation.safeParse(orderData);

		if (!validateData.success) {
			const errorMessage = validateData.error.issues[0].message;
			toast.error(errorMessage, { richColors: true, position: "top-right" });
			throw new Error(errorMessage);
		}

		const res = await fetch(`${BACKEND_URL}/user/order/${currentTab}`, {
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
					orderType: currentTab,
					// biome-ignore lint/style/noNonNullAssertion: <selected ouctome will be verified in the mutation func>
					selectedOutcome: selectOutcome!,
				},
			}),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Place order</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<Tabs
					defaultValue="buy"
					onValueChange={(e) => {
						setCurrentTab(e as "buy" | "sell");
					}}
				>
					<TabsList variant={"line"}>
						<TabsTrigger value="buy">Buy</TabsTrigger>
						<TabsTrigger value="sell">Sell</TabsTrigger>
					</TabsList>

					<TabsContent value="buy">
						<div className="flex flex-col space-y-1">
							{outcomes.map((outcome, i) => (
								<Button
									className={`${i === selectedButton && "bg-accent-foreground text-accent hover:bg-accent-foreground"}`}
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
							{outcomes.map((outcome, i) => (
								<Button
									key={outcome.outcomeTitle}
									onClick={() => {
										setSelectedButton(i);
										setSelectedOutcome(outcome.outcomeTitle);
									}}
									variant={i === selectedButton ? "secondary" : "outline"}
									className={`${i === selectedButton && "bg-accent-foreground text-accent hover:bg-accent-foreground"}`}
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
								variant={"destructive"}
								disabled={quantity === 0 || !selectOutcome}
								onClick={() => {
									mutate();
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
	const { setMarketById, marketById, setPosition, setLatestPrice } =
		useAppStore();
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

	useQuery({
		queryFn: fetchPositionById,
		queryKey: ["positionById"],
	});

	const fetchLatestPrice = async () => {
		const res = await fetch(
			`${BACKEND_URL}/user/price/latest-prices?marketId=${marketId}`,
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

	useQuery({
		queryKey: ["fetch-latest-price"],
		queryFn: fetchLatestPrice,
	});

	if (isLoading) {
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
