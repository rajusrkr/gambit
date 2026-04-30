import { db, market, position, userSchema } from "@repo/db";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

type WithdrawalFlag = "enable" | "disable";

/**
 * Use this controller to get all pisition taken by a user
 */
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

/**
 * Change user wallet withdraw flag. It's admin only.
 */
export const changeWithdrawalStatus = async (req: Request, res: Response) => {
	const queryParams = req.query;
	const userId = queryParams.id;

	const data = queryParams.data;
	const withdrawalFlag: WithdrawalFlag = data as WithdrawalFlag;

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User id is required to change withdrawal status",
		});
	}

	try {
		const updateUserWithdrawal = await db
			.update(userSchema.user)
			.set({ withdrawalEnabled: withdrawalFlag === "enable" })
			.where(eq(userSchema.user.id, String(userId)));
		if (updateUserWithdrawal.rowCount === 0) {
			return res.status(400).json({
				success: false,
				message: "Something went wrong, unable to change withdrawal flag",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Withdrawal status updated successfully.",
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};

