import { db, market, order, position } from "@repo/db";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

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