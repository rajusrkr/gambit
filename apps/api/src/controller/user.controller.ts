import { db, position } from "@repo/db";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";

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
				totalCost: position.atTotalCost,
				avgPrice: position.avgPrice,
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
			return res
				.status(400)
				.json({
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
