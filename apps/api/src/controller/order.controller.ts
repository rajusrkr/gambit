import { db, market, order, position, userSchema } from "@repo/db";
import { and, eq, gte, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { z } from "zod";
import { LMSRLogic } from "../lib/lmsr";

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
    const dbTransactionResult = await db.transaction(async (tx) => {
      const [getUser] = await tx
        .select({ id: userSchema.user.id })
        .from(userSchema.user)
        .where(eq(userSchema.user.id, getUserId))
        .limit(1);

      if (!getUser) {
        throw new ApiError("No user found from received data", 400);
      }

      console.log("user check done");
      

      const [getMarket] = await tx
        .select({ outcomes: market.outcomes })
        .from(market)
        .where(
          and(eq(market.id, data.marketId), eq(market.marketStatus, "open")),
        )
        .limit(1)
        .for("update");

      if (!getMarket) {
        throw new ApiError(
          "No market details found with the provided market id",
          400,
        );
      }

      console.log("market check done");
      

      const selectedOutcomeIndex = getMarket.outcomes.findIndex(
        (outcome) => outcome.title === data.selectedOutcome,
      );

      if (
        selectedOutcomeIndex < 0 ||
        selectedOutcomeIndex > getMarket.outcomes.length
      ) {
        throw new ApiError(
          "Selected outcome is invalid, select a correct outcome",
          400,
        );
      }

      const lmsr = new LMSRLogic(
        getMarket.outcomes,
        selectedOutcomeIndex,
        data.orderQty,
      );

      const { calculatedOutcomes, tradeCost } = lmsr.buy();
      console.log(calculatedOutcomes);
      
      console.log("going for wallet balance update");
      
      const walletBalanceUpdate = await tx
        .update(userSchema.user)
        .set({
          walletBalance: sql`${userSchema.user.walletBalance} - ${Math.round(tradeCost)}`,
        })
        .where(
          and(
            eq(userSchema.user.id, getUser.id),
            gte(userSchema.user.walletBalance, Math.round(tradeCost)),
          ),
        );

      if (walletBalanceUpdate.rowCount === 0) {
        throw new ApiError(
          "Wallet balance is not suffiecient to proceed with the order",
          400,
        );
      }

      console.log("wallet balance update done");
      
      await tx
        .insert(position)
        .values({
          positionTakenBy: getUser.id,
          positionTakenFor: data.selectedOutcome,
          positionTakenIn: data.marketId,
          positionStatus: "open",
          pnl: 0,
          totalQtyAndAvgPrice: {
            qty: data.orderQty,
            atTotalCost: tradeCost,
            avgPrice: tradeCost / data.orderQty,
          },
        })
        .onConflictDoUpdate({
          target: [
            position.positionTakenBy,
            position.positionTakenFor,
            position.positionTakenIn,
          ],
          set: {
            totalQtyAndAvgPrice: sql`jsonb_build_object(
          'qty', (${position.totalQtyAndAvgPrice}->>'qty')::numeric + ${data.orderQty},
          'atTotalCost', (${position.totalQtyAndAvgPrice}->>'atTotalCost')::numeric + ${tradeCost},
          'avgPrice', ((${position.totalQtyAndAvgPrice}->>'atTotalCost')::numeric + ${tradeCost}) / ((${position.totalQtyAndAvgPrice}->>'qty')::numeric + ${data.orderQty})
          )`,
          },
        });

      await tx.insert(order).values({
        orderPlacedBy: getUser.id,
        orderPlacedFor: data.selectedOutcome,
        orderTakenIn: data.marketId,
        orderType: data.orderType,
        qty: data.orderQty,
        updatedPrices: calculatedOutcomes,
        orderStatus: "success",
        averageTradedPrice: tradeCost / data.orderQty,
      });

      await tx
        .update(market)
        .set({
          outcomes: calculatedOutcomes,
        })
        .where(eq(market.id, data.marketId));

      return { message: "success" };
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
