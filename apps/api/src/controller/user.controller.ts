import { db, market, order, position } from "@repo/db";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";

// Fetching positions by market id
export const fetchPositions = async (req: Request, res: Response) => {
	// @ts-expect-error, getting user id
	const getUserId = req.user.id;
	const urlParams = req.query;
	const marketId = String(urlParams.marketId);

	if (!getUserId) {
		return res.status(400).json({
			success: false,
			message: "User id required to fetch position data",
		});
	}

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message: "Market id required to fetch position data.",
		});
	}

	try {
		const getPosition = await db
			.select({
				positionId: position.id,
				marketId: position.positionTakenIn,
				outcome: position.positionTakenFor,
				avgPrice: position.buyAvgPrice,
				positionQty: position.buyQty,
				tradeCost: position.buyTradeCost,
			})
			.from(position)
			.where(
				and(
					eq(position.positionTakenBy, getUserId),
					eq(position.positionTakenIn, marketId),
					eq(position.positionStatus, "open"),
				),
			);

		if (!getPosition || getPosition.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No position available",
				positions: [],
			});
		}

		return res.status(200).json({
			success: true,
			message: "Position fetched successfully",
			positions: getPosition,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: `${error instanceof Error ? error.message : "Internal server error"}`,
		});
	}
};

// Fethc all position for a user
export const fetchAllPosition = async (req: Request, res: Response) => {
	// @ts-expect-error, getting user id
	const getUserId = req.user.id;

	if (!getUserId) {
		return res.status(400).json({
			success: false,
			message: "User id is required to fetch positions",
		});
	}

	try {
		const getPositions = await db
			.select({
				positionId: position.id,
				marketTitle: market.title,
				outcomeTitle: position.positionTakenFor,
				qty: position.availableQty,
				avgPrice: position.buyAvgPrice,
				marketId: market.id,
			})
			.from(position)
			.where(eq(position.positionTakenBy, getUserId))
			.innerJoin(market, eq(market.id, position.positionTakenIn));

		if (!getPositions || getPositions.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No positon availanble",
				positions: [],
			});
		}

		return res.status(200).json({
			success: true,
			message: "Positions fetched successfully",
			positions: getPositions,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";

		return res.status(500).json({ success: false, message: errorMessage });
	}
};

// Get price history
export const getPriceHistory = async (req: Request, res: Response) => {
	const params = req.query;

	const marketId = params.marketId;

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message: "Market is require to fetch price history",
		});
	}

	// 	export interface ChartData {
	// 	marketId: string;
	// 	marketTitle: string;
	// 	priceData: {
	// 		outcomeTitle: string;
	// 		color: string;
	// 		prices: {
	// 			time: string;
	// 			value: number;
	// 		}[];
	// 	}[];
	// }

	try {
		const getPriceHistory = await db
			.select({
				prices: order.updatedPrices,
				time: order.createdAt,
			})
			.from(order)
			.where(eq(order.orderTakenIn, String(marketId)))
			.innerJoin(market, eq(market.id, String(marketId)));

		if (getPriceHistory.length === 0) {
			return res.status(200).json({
				success: false,
				message: "There is no price history for this market",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Price history fetched for the market",
			priceHistory: getPriceHistory,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};
