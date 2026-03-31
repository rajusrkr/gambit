import {
	db,
	market,
	marketOutcomes,
	order,
	position,
	userSchema,
	userTransactions,
} from "@repo/db";
import { Decimal } from "decimal.js";
import { and, eq, gte, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";
import { LMSRLogic } from "../lib/lmsr";

Decimal.set({ precision: 36 });

// Error message
class ApiError extends Error {
	public statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

// Zod validations
const orderTypeEnum = z.enum(["buy", "sell"]);
const orderDataValidation = z.object({
	marketId: z.string(),
	orderType: orderTypeEnum,
	orderQty: z.number().min(1, "Minimum order qty is 1"),
	selectedOutcome: z.string(),
});
const sellOrderDataValidation = z.object({
	positionId: z.string(),
	marketId: z.string(),
	orderType: orderTypeEnum,
	orderQty: z.number().min(1, "Minimum order qty is 1"),
	selectedOutcome: z.string(),
});

// Buy order
export const buyOrder = async (req: Request, res: Response) => {
	//@ts-expect-error, getting user
	const getUserId = req.user.id;

	if (!getUserId) {
		return res.status(401).json({
			success: false,
			message: "No user data received, try again later",
		});
	}

	const orderData = req.body;
	const validateData = orderDataValidation.safeParse(orderData);
	const { success, error, data } = validateData;

	if (!success) {
		const errorMessage = error.issues[0].message;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const dbTransactionResult = await db.transaction(
			async (tx): Promise<{ orderId: string }> => {
				const [getUser] = await tx
					.select({ id: userSchema.user.id })
					.from(userSchema.user)
					.where(eq(userSchema.user.id, getUserId))
					.limit(1);

				if (!getUser) {
					throw new ApiError("No user found from received data", 400);
				}

				const [getMarketOutcomeAndMarketStatus] = await tx
					.select({
						marketTitle: market.title,
						status: market.marketStatus,
						titles: marketOutcomes.titles,
						prices: marketOutcomes.prices,
						volumes: marketOutcomes.volume,
					})
					.from(marketOutcomes)
					.innerJoin(
						market,
						and(
							eq(marketOutcomes.marketId, data.marketId),
							eq(market.marketStatus, "open"),
						),
					)
					.for("update");

				if (!getMarketOutcomeAndMarketStatus) {
					throw new ApiError(
						`The market with provided id ${data.marketId} is not available to take order`,
						400,
					);
				}

				const selectedOutcomeIndex =
					getMarketOutcomeAndMarketStatus.titles.indexOf(data.selectedOutcome);

				if (selectedOutcomeIndex < 0) {
					throw new ApiError(
						"Invalid outcome selected, try with proper outcome",
						400,
					);
				}

				const volumes = getMarketOutcomeAndMarketStatus.volumes;
				const lmsr = new LMSRLogic(
					selectedOutcomeIndex,
					data.orderQty,
					volumes,
				);
				const { tradeCost, newPrices, newVolumes } = lmsr.buy();

				const newOutcomesVolumeAndPrices =
					getMarketOutcomeAndMarketStatus.titles.map((outcome, i) => ({
						title: outcome,
						price: String(newPrices[i]),
						volume: Number(newVolumes[i]),
					}));

				const walletBalanceUpdate = await tx
					.update(userSchema.user)
					.set({
						walletBalance: sql`${userSchema.user.walletBalance} - ${String(tradeCost)}`,
					})
					.where(
						and(
							eq(userSchema.user.id, getUser.id),
							gte(
								userSchema.user.walletBalance,
								sql`${String(tradeCost)}::numeric(36,18)`,
							),
						),
					);

				if (walletBalanceUpdate.rowCount === 0) {
					throw new ApiError(
						`Wallet balance is not suffiecient to proceed with the order. Balance required - ${tradeCost}`,
						400,
					);
				}

				await tx.insert(userTransactions).values({
					transactionType: "debit",
					reason: "trade:buy",
					details: `Bought ${data.orderQty} qty of ${getMarketOutcomeAndMarketStatus.marketTitle} for outcome ${data.selectedOutcome}`,
					amount: String(tradeCost),
				});

				const avgPricePerShare = new Decimal(String(tradeCost))
					.div(String(data.orderQty))
					.toString();

				await tx
					.insert(position)
					.values({
						positionTakenBy: getUser.id,
						positionTakenFor: data.selectedOutcome,
						positionTakenIn: data.marketId,
						positionStatus: "open",
						buyQty: data.orderQty,
						availableQty: data.orderQty,
						buyTradeCost: String(tradeCost),
						buyAvgPrice: avgPricePerShare,
					})
					.onConflictDoUpdate({
						target: [
							position.positionTakenBy,
							position.positionTakenFor,
							position.positionTakenIn,
						],
						set: {
							buyQty: sql`${position.buyQty} + ${data.orderQty}`,

							buyTradeCost: sql`${position.buyTradeCost} + ${String(tradeCost)}::numeric(36,18)`,

							buyAvgPrice: sql`(${position.buyTradeCost} + ${String(tradeCost)}::numeric(36,18)) / ((${position.buyQty} + ${String(data.orderQty)})::numeric(36,18))`,

							availableQty: sql`COALESCE(${position.availableQty}, 0) + ${data.orderQty}`,
						},
					});

				const [newOrder] = await tx
					.insert(order)
					.values({
						orderPlacedBy: getUser.id,
						orderPlacedFor: data.selectedOutcome,
						orderTakenIn: data.marketId,
						orderType: data.orderType,
						qty: data.orderQty,
						updatedPrices: newOutcomesVolumeAndPrices,
						orderStatus: "success",
						averageTradedPrice: String(avgPricePerShare),
					})
					.returning({ id: order.id });

				await tx
					.update(marketOutcomes)
					.set({
						prices: newPrices,
						volume: newVolumes,
					})
					.where(eq(marketOutcomes.marketId, data.marketId));

				return { orderId: newOrder.id };
			},
		);

		return res.status(200).json({
			success: true,
			message: `Order successful. Order id - ${dbTransactionResult.orderId}`,
		});
	} catch (error: any) {
		const statusCode = error.statusCode || 500;
		const errorMessage = error.message || "Internal server error";
		return res
			.status(statusCode)
			.json({ success: false, message: errorMessage });
	}
};

// Sell order
export const sellOrder = async (req: Request, res: Response) => {
	// @ts-expect-error, getting the user id
	const getUserId = req.user.id;
	if (!getUserId) {
		return res.status(400).json({
			success: false,
			message: "Backend did not able to get user id from provided data",
		});
	}

	const orderData = req.body;
	const validateData = sellOrderDataValidation.safeParse(orderData);
	const { success, data, error } = validateData;

	if (!success) {
		const errorMessage = `${error.issues[0].message} ${error.issues[0].path}`;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const dbTransactionResult = await db.transaction(
			async (tx): Promise<{ orderId: string }> => {
				const [getPositionDetails] = await tx
					.select()
					.from(position)
					.where(eq(position.id, data.positionId));

				if (!getPositionDetails) {
					throw new ApiError(
						"No position available to process with sell order",
						400,
					);
				}

				if (getPositionDetails.availableQty < data.orderQty) {
					throw new ApiError(
						"Quantity is not sufficient to proceed with sell order",
						400,
					);
				}

				const [getUser] = await tx
					.select()
					.from(userSchema.user)
					.where(eq(userSchema.user.id, getUserId));

				if (!getUser) {
					throw new ApiError("User not found with provided data", 400);
				}

				const [getMarketOutcomeAndMarketStatus] = await tx
					.select({
						marketTitle: market.title,
						status: market.marketStatus,
						titles: marketOutcomes.titles,
						prices: marketOutcomes.prices,
						volumes: marketOutcomes.volume,
					})
					.from(marketOutcomes)
					.innerJoin(
						market,
						and(
							eq(marketOutcomes.marketId, data.marketId),
							eq(market.marketStatus, "open"),
						),
					)
					.for("update");

				if (!getMarketOutcomeAndMarketStatus) {
					throw new ApiError(
						`The market with provided id ${data.marketId} is not available to take order`,
						400,
					);
				}

				const selectedOutcomeIndex =
					getMarketOutcomeAndMarketStatus.titles.indexOf(data.selectedOutcome);

				if (selectedOutcomeIndex < 0) {
					throw new ApiError(
						"Invalid outcome selected, try with proper outcome",
						400,
					);
				}

				const volumes = getMarketOutcomeAndMarketStatus.volumes;
				const lmsr = new LMSRLogic(
					selectedOutcomeIndex,
					data.orderQty,
					volumes,
				);

				const { newPrices, newVolumes, returnToTheUser } = lmsr.sell();

				const newOutcomesVolumeAndPrices =
					getMarketOutcomeAndMarketStatus.titles.map((outcome, i) => ({
						title: outcome,
						price: String(newPrices[i]),
						volume: Number(newVolumes[i]),
					}));

				const walletBalanceUpdate = await tx
					.update(userSchema.user)
					.set({
						walletBalance: sql`${userSchema.user.walletBalance} + ${String(returnToTheUser)}`,
					})
					.where(eq(userSchema.user.id, getUserId));

				if (walletBalanceUpdate.rowCount === 0) {
					throw new ApiError(
						"Unable to update user wallet balance, aborting.",
						500,
					);
				}

				await tx.insert(userTransactions).values({
					transactionType: "credit",
					reason: "trade:sell",
					details: `Sold ${data.orderQty} qty of ${getMarketOutcomeAndMarketStatus.marketTitle} for outcome ${data.selectedOutcome}`,
					amount: String(returnToTheUser),
				});

				const avgPricePerShare = new Decimal(String(returnToTheUser)).div(
					String(data.orderQty),
				);

				const updatePosition = await tx
					.update(position)
					.set({
						sellQty: sql`COALESCE(${position.sellQty}, 0) + ${data.orderQty}`,

						sellTradeReturn: sql`COALESCE(${position.sellTradeReturn}, 0) + ${String(returnToTheUser)}::numeric(36,18)`,

						sellAvgPrice: sql`(COALESCE(${position.sellTradeReturn}, 0) + ${String(returnToTheUser)}::numeric(36,18)) / ((COALESCE(${position.sellQty}, 0) + ${String(data.orderQty)})::numeric(36,18))`,

						// New logic
						realizedPnl: sql`((${String(avgPricePerShare)} - ${position.buyAvgPrice}) * ${data.orderQty})::numeric(36,18) + (COALESCE(${position.realizedPnl}, 0))`,

						// Available qty minus order qty
						availableQty: sql`COALESCE(${position.availableQty}, 0) - ${data.orderQty}`,
					})
					.where(eq(position.id, data.positionId))
					.returning();

				console.log(updatePosition);
				console.log(returnToTheUser);

				const [newOrder] = await tx
					.insert(order)
					.values({
						orderPlacedBy: getUserId,
						orderPlacedFor: data.selectedOutcome,
						orderStatus: "success",
						orderTakenIn: data.marketId,
						orderType: "sell",
						qty: data.orderQty,
						averageTradedPrice: String(avgPricePerShare),
						updatedPrices: newOutcomesVolumeAndPrices,
					})
					.returning({ id: order.id });

				await tx
					.update(marketOutcomes)
					.set({
						prices: newPrices,
						volume: newVolumes,
					})
					.where(eq(marketOutcomes.marketId, data.marketId));

				return { orderId: newOrder.id };
			},
		);

		return res.status(200).json({
			success: true,
			message: `Order successful. Order id: ${dbTransactionResult.orderId}`,
		});
	} catch (error: any) {
		const statusCode = error.statusCode || 500;
		const errorMessage = error.message || "Internal server error";
		return res
			.status(statusCode)
			.json({ success: false, message: errorMessage });
	}
};

// Order history of all users for a particular market
export const orderHistory = async (req: Request, res: Response) => {
	const params = req.query;
	const marketId = params.marketId;

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message:
				"Market id is undefined. Market id is required to fetch order history",
		});
	}

	try {
		const getOrderHistory = await db
			.select({
				outcome: order.orderPlacedFor,
				qty: order.qty,
				avgPrice: order.averageTradedPrice,
				orderedBy: userSchema.user.name,
				orderId: order.id,
			})
			.from(order)
			.where(eq(order.orderTakenIn, String(marketId)))
			.innerJoin(userSchema.user, eq(userSchema.user.id, order.orderPlacedBy));

		if (getOrderHistory.length === 0) {
			return res
				.status(200)
				.json({ success: false, messafe: "No order found for this market" });
		}

		return res.status(200).json({
			success: true,
			message: "Market order history fetched successfully",
			orders: getOrderHistory,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: `${error instanceof Error ? `${error.message}` : "Internal server error"}`,
		});
	}
};
