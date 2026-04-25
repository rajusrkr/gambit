import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { IconCircleDashedX, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarket } from "../hook/useMarket";
import type { MARKET_CATEGORY } from "../types";
import { useMarketCardsFilter } from "../zustand-store";

/**
 * Market cards component, markets will be fetched here and render those market data in cards format using shadcn card compoent.
 * This componet is exclusive to market.tsx.
 */
export default function MarketCards() {
	const { marketCategory, setMarketCategory } = useMarketCardsFilter();
	const { latestPrices, markets, isLoading, fetchNextPage, isFethingNextPage } =
		useMarket({
			category: marketCategory,
			limit: "21",
			status: "open",
		});

	const { ref, inView } = useInView();
	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	return (
		<>
			<div className="mb-4">
				<Tabs
					defaultValue={marketCategory}
					onValueChange={(e) => {
						setMarketCategory({ category: e as MARKET_CATEGORY });
					}}
				>
					<TabsList variant={"line"}>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="sports">Sports</TabsTrigger>
						<TabsTrigger value="crypto">Crypto</TabsTrigger>
						<TabsTrigger value="weather">Weather</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Loader */}
			{isLoading ? (
				<div className="flex justify-center items-center h-[70vh]">
					<IconLoader2 className="animate-spin" />
				</div>
			) : //  If no markets
			!markets || markets.length === 0 ? (
				<div>
					<div className="flex justify-center items-center h-[70vh] max-w-96 mx-auto">
						<Item variant="outline">
							<ItemMedia variant="icon">
								<IconCircleDashedX />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>No markets available</ItemTitle>
								<ItemDescription>
									There are no open markets available for the selected filter,
									please try again later.
								</ItemDescription>
							</ItemContent>
						</Item>
					</div>
				</div>
			) : (
				// Market cards
				<div className="grid md:grid-cols-3 grid-cols-1 gap-4 pb-4">
					{markets.map((m) => (
						<Card
							key={m.marketId}
							className="dark:bg-[#1e2428] relative dark:hover:bg-[#242b32] transition-all"
						>
							<CardHeader className="h-10">
								<CardTitle className="text-xl font-bold">
									<Link to={`/market/${m.marketId}`}>
										<span className="hover:underline underline-offset-1">
											{m.marketTitle}
										</span>
									</Link>
								</CardTitle>
							</CardHeader>

							<CardContent className="mb-2">
								{m.outcomes.length === 2 && (
									<div className="w-full flex gap-1">
										{m.outcomes.map((outcome) => (
											<Button className="flex-1 capitalize" key={outcome.title}>
												{outcome.title} -{" "}
												{Math.floor(
													Number(
														latestPrices?.[m.marketId]?.prices.find(
															(price) => price.title === outcome.title,
														)?.price,
													) * 100,
												)}
											</Button>
										))}
									</div>
								)}

								{m.outcomes.length > 2 && m.outcomes.length < 6 && (
									<div className="w-full grid grid-cols-3 gap-1 pb-4">
										{m.outcomes.map((outcome) => (
											<Button key={outcome.title}>
												{outcome.title}-{" "}
												{Math.floor(
													Number(
														latestPrices?.[m.marketId]?.prices.find(
															(price) => price.title === outcome.title,
														)?.price,
													) * 100,
												)}
											</Button>
										))}
									</div>
								)}

								{m.outcomes.length > 5 && (
									<div className="w-full grid grid-cols-3 gap-1 pb-4">
										{[
											...m.outcomes.slice(0, 5),
											{ price: "0", volume: 0, title: "See more" },
										].map((outcome) => (
											<Button key={outcome.title}>{outcome.title}</Button>
										))}
									</div>
								)}
							</CardContent>

							<CardFooter className="absolute bottom-0 pb-1">
								<div className="flex items-center gap-1">
									<span className="relative flex size-3">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
										<span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
									</span>
									<span className="capitalize">
										{m.marketStatus.replaceAll("_", " ")}
									</span>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
			<div
				ref={ref}
				className="justify-center items-center flex pb-4 font-semibold text-gray-500"
			>
				{isFethingNextPage && "Loading more..."}
			</div>
		</>
	);
}
