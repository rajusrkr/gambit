import { db, order, position } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";
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
				avgPrice: position.avgPrice,
				positionQty: position.qty,
				tradeCost: position.atTotalCost,
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

// Fetch latest price for a market
export const fetchLatestPrice = async (req: Request, res: Response) => {
	const urlParams = req.query;
	const marketId = String(urlParams.marketId);

	if (!marketId) {
		return res.status(200).json({
			success: false,
			message: "Market id required to fetch latest prices",
		});
	}

	try {
		const getLatestPrice = await db
			.select({
				marketId: order.orderTakenIn,
				prices: order.updatedPrices,
			})
			.from(order)
			.where(eq(order.orderTakenIn, marketId))
			.orderBy(desc(order.createdAt))
			.limit(1);

		if (!getLatestPrice || getLatestPrice.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No latest price found for the market",
				latestPrice: null,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Latest price fetched",
			latestPrices: getLatestPrice,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message:
				error instanceof Error ? `${error.message}` : "Internal server error",
		});
	}
};
