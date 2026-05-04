import { db, market, position, userSchema } from "@repo/db";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { v7 as uuidv7 } from "uuid";
import z from "zod";

const AccountStatusSchema = z.object({
	status: z.enum(["active", "suspended"]),
	userId: z.string(),
});

const AccountWithdrawalStatusSchema = z.object({
	status: z.enum(["yes", "no"]),
	userId: z.string(),
});

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
export const changeAccountWithdrawalStatus = async (
	req: Request,
	res: Response,
) => {
	const queryParams = req.body;
	const { success, data, error } =
		AccountWithdrawalStatusSchema.safeParse(queryParams);
	if (!success) {
		const errorMessage = error.issues[0].message;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const updateAccountStatus = await db
			.update(userSchema.user)
			.set({ isWithdrawalOn: data.status })
			.where(eq(userSchema.user.id, data.userId));
		if (updateAccountStatus.rowCount === 0) {
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

/**
 * Change user wallet withdraw flag. It's admin only.
 */
export const changeAccountStatus = async (req: Request, res: Response) => {
	const queryParams = req.body;
	const { success, data, error } = AccountStatusSchema.safeParse(queryParams);
	if (!success) {
		const errorMessage = error.issues[0].message;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const updateAccountStatus = await db
			.update(userSchema.user)
			.set({ isAccountActive: data.status })
			.where(eq(userSchema.user.id, data.userId));
		if (updateAccountStatus.rowCount === 0) {
			return res.status(400).json({
				success: false,
				message: "Something went wrong, unable to change account status flag",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Account status updated successfully.",
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};

/**
 * Create dummy users
 */

export const dummyUsers = async (req: Request, res: Response) => {
	const data = req.body;
	const userData = data.data;

	try {
		const createuser = await db.insert(userSchema.user).values({
			email: userData.email,
			name: userData.name,
			id: uuidv7(),
		});

		if (createuser.rowCount === 0) {
			return res.status(400).json({ s: false, m: "Unable to create user" });
		}

		return res.status(200).json({ s: true, m: "user created successfully" });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};
