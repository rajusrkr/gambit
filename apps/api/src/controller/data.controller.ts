import { db, market, marketOutcomes } from "@repo/db";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import z from "zod";
import { processMarketData } from "../lib/helpers/format-data";

const QueryParamsSchema = z.object({
	pageParam: z.string(),
	limit: z.enum(["21", "31", "41"]),
	category: z.enum(["sports", "crypto", "weather", "all"]),
	status: z.enum([
		"open",
		"settled",
		"new_order_paused",
		"open_soon",
		"canceled",
		"all",
	]),
});

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
		const getLatestPricesFromOutcomes = await db
			.select({
				marketId: marketOutcomes.marketId,
				titles: marketOutcomes.titles,
				prices: marketOutcomes.prices,
				volume: marketOutcomes.volume,
			})
			.from(marketOutcomes)
			.where(inArray(marketOutcomes.marketId, marketIdsArr));

		const formatted = getLatestPricesFromOutcomes.map((latest) => ({
			marketId: latest.marketId,
			prices: latest.prices.map((price, i) => ({
				price,
				title: latest.titles[i],
				volume: latest.volume[i],
			})),
		}));

		return res.status(200).json({
			success: true,
			message: "Latest price fetched",
			latestPrice: formatted,
		});
	} catch (error) {
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

/**
 * Paginated market data fetching.
 */
export const getPaginatedMarketQueryData = async (
	req: Request,
	res: Response,
) => {
	const params = req.query;
	const { success, data, error } = QueryParamsSchema.safeParse(params);

	if (!success) {
		const errorMessage = error.issues[0].message;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const [getMarketCount] = await db.select({ count: count() }).from(market);
		if (getMarketCount.count === 0) {
			return res.status(200).json({
				success: true,
				message: "No markets available to show",
				markets: [],
			});
		}
		const totalPage = Math.ceil(getMarketCount.count / Number(data.limit));
		const offset = Number(data.pageParam) * Number(data.limit);

		const getMarketData = await db
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
			.innerJoin(marketOutcomes, eq(market.id, marketOutcomes.marketId))
			.where(
				and(
					data.category !== "all"
						? eq(market.category, data.category)
						: undefined,
					data.status !== "all"
						? eq(market.marketStatus, data.status)
						: undefined,
				),
			)
			.orderBy(desc(market.createdAt))
			.limit(Number(data.limit))
			.offset(offset);

		if (getMarketData.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No market available with those filters",
				markets: [],
			});
		}

		const processedMarketData = processMarketData({
			marketData: getMarketData,
		});

		const marketData = {
			totalCount: getMarketCount.count,
			currentPage: Number(data.pageParam),
			nextPage:
				Number(data.pageParam) + 1 < totalPage
					? Number(data.pageParam) + 1
					: null,
			totalPage,
			marketsData: processedMarketData,
		};

		return res
			.status(200)
			.json({ success: true, message: "Markets fetched", markets: marketData });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Internal server error",
		});
	}
};
