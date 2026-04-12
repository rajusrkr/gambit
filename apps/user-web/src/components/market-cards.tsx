import {
	IconCircleDashedX,
	IconCircleX,
	IconLoader2,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useMarkets } from "@/hooks/fetch/useMarket";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "./ui/item";

/**
 * Market cards component, markets will be fetched here and render those market data in cards format using shadcn card compoent.
 * This componet is exclusive to market.tsx.
 */
export default function MarketCards() {
	const {
		marketLatestPriceQueryError,
		marketQueryError,
		isPending,
		market,
		latestPrice,
	} = useMarkets();

	if (isPending) {
		return (
			<div className="flex justify-center items-center h-[80vh]">
				<IconLoader2 className="animate-spin" />
			</div>
		);
	}

	if (marketQueryError) {
		return <div>{marketQueryError.message}</div>;
	}

	if (marketLatestPriceQueryError) {
		toast.error(marketLatestPriceQueryError.message, {
			richColors: true,
			position: "top-right",
		});
	}
	if (!market || market.length === 0) {
		return (
			<div className="flex justify-center items-center h-[80vh] max-w-96 mx-auto">
				<Item variant="outline">
					<ItemMedia variant="icon">
						<IconCircleDashedX />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>No markets available</ItemTitle>
						<ItemDescription>
							There are no markets available to trade at the moment, please try
							again later.
						</ItemDescription>
					</ItemContent>
				</Item>
			</div>
		);
	}

	return (
		<>
			{market.length === 0 ? (
				<div className="flex justify-center items-center h-[80vh]">
					<div className="flex justify-center items-center flex-col">
						<IconCircleX className="text-gray-500" />

						<p className="text-2xl font-semibold text-gray-500">
							No markets avaialble to show
						</p>
					</div>
				</div>
			) : (
				<div className="grid md:grid-cols-3 grid-cols-1 gap-4">
					{market.map((m) => (
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
														latestPrice?.[m.marketId]?.prices.find(
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
														latestPrice?.[m.marketId]?.prices.find(
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
		</>
	);
}
