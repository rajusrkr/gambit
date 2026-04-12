import { db, market, marketOutcomes, order } from "@repo/db";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import type { Request, Response } from "express";
import { processMarketData } from "../lib/helpers/format-data";

/**
 * Get market data controller, you can get all markets for
 * user home from this controller.
 */
export const getMarkets = async (_req: Request, res: Response) => {
	try {
		const markets = await db
			.select({
				marketId: market.id,
				marketTitle: market.title,
				outcomes: {
					titles: marketOutcomes.titles,
					volume: marketOutcomes.volume,
					prices: marketOutcomes.prices,
				},
				marketStatus: market.marketStatus,
				marketCategory: market.category,
			})
			.from(market)
			.innerJoin(marketOutcomes, eq(marketOutcomes.marketId, market.id))
			.where(and(ne(market.marketStatus, "open_soon")))
			.orderBy(desc(market.createdAt));

		if (markets.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No markets available",
				markets: [],
			});
		}

		const processedMarketData = processMarketData({ marketData: markets });

		return res.status(200).json({
			success: true,
			message: "Market fetched successfully",
			markets: processedMarketData,
		});
	} catch (error: any) {
		const errorCode = error.statusCode || 500;
		const errorMessage = error.message || "Internal server error";
		return res
			.status(errorCode)
			.json({ success: false, message: errorMessage });
	}
};

/**
 * Get market latest prices from this controller.
 */
export const getLatestPrices = async (req: Request, res: Response) => {
	const urlParams = req.query;
	const marketIds = urlParams.id;

	let marketIdsArr: string[] | any = [];

	if (typeof marketIds === "string") {
		marketIdsArr.push(marketIds);
	} else if (typeof marketIds === "object") {
		marketIdsArr = marketIds;
	} else {
		return res.status(400).json({
			success: false,
			message: "Market id(s) required to fetch latest prices",
		});
	}

	try {
		const getLatestPrice = await db
			.selectDistinctOn([order.orderTakenIn], {
				marketId: order.orderTakenIn,
				prices: order.updatedPrices,
				time: order.createdAt,
			})
			.from(order)
			.where(inArray(order.orderTakenIn, marketIdsArr))
			.orderBy(desc(order.orderTakenIn), desc(order.createdAt));

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
			latestPrice: getLatestPrice,
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

/**
 * Get market data by id.
 * From this controller client can fetch a market data by id
 */
export const getMarketById = async (req: Request, res: Response) => {
	const paramsData = req.query;

	const marketId = paramsData.marketId;

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message: "Invalid market id, try with proper inputs",
		});
	}

	try {
		const [getMarketById] = await db
			.select({
				id: market.id,
				title: market.title,
				description: market.description,
				settlementRules: market.settlementRules,
				marketType: market.category,
				marketStatus: market.marketStatus,
				closing: market.marketEnds,
				price: marketOutcomes.prices,
				outcomesTitle: marketOutcomes.titles,
				volumes: marketOutcomes.volume,
			})
			.from(market)
			.innerJoin(marketOutcomes, eq(marketOutcomes.marketId, String(marketId)))
			.where(eq(market.id, String(marketId)));

		if (!getMarketById) {
			return res.status(400).json({
				success: false,
				message: "No market data found with provided market id",
			});
		}

		const {
			title,
			description,
			settlementRules,
			marketType,
			closing,
			outcomesTitle,
			price,
			volumes,
			marketStatus,
			id,
		} = getMarketById;

		const fromattedMarketData = {
			id,
			title,
			description,
			settlementRules,
			marketType,
			closing,
			marketStatus,
			outcomes: outcomesTitle.map((outcomeTitle, i) => ({
				outcomeTitle,
				price: price[i],
				volume: volumes[i],
			})),
		};

		return res.status(200).json({
			success: true,
			message: "Market fetched",
			marketById: fromattedMarketData,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message:
				error instanceof Error ? `${error.message}` : "Internal server error",
		});
	}
};
