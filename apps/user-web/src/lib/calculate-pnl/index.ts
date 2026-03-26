import { Decimal } from "decimal.js";
import type { LatestPrice, Position } from "../zustand-store";

function calculatePnl({
	outcomeTitle,
	latestPrices,
	positions,
	marketId,
}: {
	outcomeTitle: string;
	positions: Position[];
	latestPrices: LatestPrice[];
	marketId: string;
}) {
	const { positionQty, tradeCost } =
		positions[
			positions.findIndex((position) => position.outcome === outcomeTitle)
		];
	const findMarket = latestPrices.find((price) => price.marketId === marketId);

	if (!findMarket) {
		throw new Error("Unable to find latest price for the market");
	}

	const { price } =
		findMarket.prices[
			findMarket.prices.findIndex((price) => price.title === outcomeTitle)
		];

	const tradeCostInDecimal = new Decimal(tradeCost);
	const qtyInDecimal = new Decimal(positionQty);
	const multiplier = new Decimal(100);
	const latestPriceInDecimal = new Decimal(price).times(multiplier);

	const currentTradePrice = latestPriceInDecimal.times(qtyInDecimal);

	const pnl = currentTradePrice.minus(tradeCostInDecimal);

	const roundedPnl = Math.floor(Number(pnl) * 100) / 100;

	return roundedPnl;
}

export { calculatePnl };
