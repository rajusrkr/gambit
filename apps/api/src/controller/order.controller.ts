import {
  db,
  market,
  marketOutcomes,
  order,
  position,
  userSchema,
  userTransactions,
} from "@repo/db";
import { and, eq, gte, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { z } from "zod";
import { LMSRLogic } from "../lib/lmsr";

import { Decimal } from "decimal.js";
Decimal.set({ precision: 36 });

class ApiError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const orderTypeEnum = z.enum(["buy", "sell"]);
const orderDataValidation = z.object({
  marketId: z.string(),
  orderType: orderTypeEnum,
  orderQty: z.number().min(1, "Minimum order qty is 1"),
  selectedOutcome: z.string(),
});

export const buyOrder = async (req: Request, res: Response) => {
  //@ts-ignore, getting user
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
          getMarketOutcomeAndMarketStatus.titles.findIndex(
            (title) => title === data.selectedOutcome,
          );

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
            qty: data.orderQty,
            atTotalCost: String(tradeCost),
            avgPrice: avgPricePerShare,
          })
          .onConflictDoUpdate({
            target: [
              position.positionTakenBy,
              position.positionTakenFor,
              position.positionTakenIn,
            ],
            set: {
              qty: sql`${position.qty} + ${data.orderQty}`,
              atTotalCost: sql`${position.atTotalCost} + ${String(tradeCost)}::numeric(36,18)`,
              avgPrice: sql`(${position.atTotalCost} + ${String(tradeCost)}::numeric(36,18)) / ((${position.qty} + ${String(data.orderQty)})::numeric(36,18))`,
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
    console.log(error);

    return res
      .status(statusCode)
      .json({ success: false, message: errorMessage });
  }
};

// export const sellOrder = async (req: Request, res: Response) => {};
