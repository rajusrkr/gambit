import {
	db,
	discussions,
	market,
	marketOutcomes,
	order,
	position,
	userSchema,
} from "@repo/db";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import z from "zod";
import { processMarketData } from "../lib/helpers/format-data";

/**
 *  Query params schema for market filtering
 */
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
 * Query params schema for user filyering
 */
const QueryParamsSchemaUser = z.object({
	pageParam: z.string(),
	filters: z.object({
		label: z.enum(["Registered", "Wallet Balance"]),
		value: z.enum(["none", "lowest", "highest", "latest", "oldest"]),
	}),
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
		const [getMarketCount] = await db
			.select({ count: count() })
			.from(market)
			.where(
				and(
					data.category !== "all"
						? eq(market.category, data.category)
						: undefined,
					data.status !== "all"
						? eq(market.marketStatus, data.status)
						: undefined,
				),
			);
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
/**
 * Get position of an individual market of a user
 */
export const getPositionByMarketId = async (req: Request, res: Response) => {
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
				avgPrice: position.buyAvgPrice,
				positionQty: position.buyQty,
				tradeCost: position.buyTradeCost,
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
			return res.status(200).json({
				success: true,
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
/**
 * Get price history of a market by market id
 */
export const getPriceHistory = async (req: Request, res: Response) => {
	const params = req.query;
	const marketId = params.marketId;

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message: "Market is require to fetch price history",
		});
	}

	try {
		const getPriceHistory = await db
			.select({
				prices: order.updatedPrices,
				time: order.createdAt,
			})
			.from(order)
			.where(eq(order.orderTakenIn, String(marketId)))
			.innerJoin(market, eq(market.id, String(marketId)));

		if (getPriceHistory.length === 0) {
			return res.status(200).json({
				success: true,
				message: "There are no price history for this market",
				priceHistory: [],
			});
		}

		return res.status(200).json({
			success: true,
			message: "Price history fetched for the market",
			priceHistory: getPriceHistory,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};
/**
 * Discussions controller.
 * Get discussions data from this controller
 */
export const getDiscussion = async (req: Request, res: Response) => {
	const queryParams = req.query;
	const marketId = queryParams.marketId;

	if (!marketId) {
		return res.status(400).json({
			success: false,
			message: "Market id is required to fetch discussions",
		});
	}

	try {
		const getMarketDiscussion = await db
			.select({
				id: discussions.id,
				message: discussions.message,
				userName: userSchema.user.name,
				userId: userSchema.user.id,
			})
			.from(discussions)
			.innerJoin(userSchema.user, eq(discussions.messageBy, userSchema.user.id))
			.orderBy(desc(discussions.createdAt));

		if (getMarketDiscussion.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No discussions available for this market",
				discussions: [],
			});
		}

		return res.status(200).json({
			success: true,
			message: "Discussions fetched",
			discussions: getMarketDiscussion,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Internal server error",
		});
	}
};
/**
 * Order history.
 * Get order history of a particular market
 */
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
			return res.status(200).json({
				success: true,
				message: "No order found for this market",
				orders: [],
			});
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

/**
 * Get all users from this controller. It's admin only.
 */
export const getAllusers = async (req: Request, res: Response) => {
	const params = req.query;
	const filterData = {
		pageParam: params.pageParam,
		filters: JSON.parse(String(params.filters)),
	};
	const validateFilterData = QueryParamsSchemaUser.safeParse(filterData);
	const { success, data, error } = validateFilterData;

	if (!success) {
		const errorMessage = error.issues[0].message;
		return res.status(400).json({ success: false, message: errorMessage });
	}

	const pageParam = data.pageParam;
	const filters = data.filters;
	const limit = 30;

	try {
		const [getTotalUserCount] = await db
			.select({ count: count() })
			.from(userSchema.user);

		if (getTotalUserCount.count === 0) {
			return res
				.status(200)
				.json({ success: true, message: "No users avaialble", users: [] });
		}

		const totalPage = Math.ceil(getTotalUserCount.count / limit);
		const offset = Number(pageParam) * limit;

		const getUsers = await db
			.select({
				userId: userSchema.user.id,
				name: userSchema.user.name,
				email: userSchema.user.email,
				balance: userSchema.user.walletBalance,
				registeredOn: userSchema.user.createdAt,
			})
			.from(userSchema.user)
			.limit(limit)
			.offset(offset)
			.orderBy(
				...(filters.label === "Registered" && filters.value === "latest"
					? [desc(userSchema.user.createdAt)]
					: filters.label === "Registered" && filters.value === "oldest"
						? [asc(userSchema.user.createdAt)]
						: []),
				...(filters.label === "Wallet Balance" && filters.value === "highest"
					? [desc(userSchema.user.walletBalance)]
					: filters.label === "Wallet Balance" && filters.value === "lowest"
						? [asc(userSchema.user.walletBalance)]
						: []),
				asc(userSchema.user.id),
			);

		if (getUsers.length === 0) {
			return res.status(200).json({
				success: false,
				message: "No users available",
				users: [],
			});
		}

		const paginatedData = {
			totalUserCount: getTotalUserCount.count,
			currentPage: Number(pageParam),
			nextPage:
				Number(pageParam) + 1 < totalPage ? Number(pageParam) + 1 : null,

			totalPage,
			users: getUsers,
		};

		return res.status(200).json({
			success: true,
			message: "Users fetched successfully",
			usersData: paginatedData,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};

/**
 * Get a single user by id
 */
export const getUser = async (req: Request, res: Response) => {
	const queryParams = req.query;
	const userId = queryParams.userId;

	if (!userId) {
		return res
			.status(400)
			.json({
				success: false,
				message: "User is required for fetching user details",
			});
	}

	try {
		const [user] = await db
			.select({
				name: userSchema.user.name,
				email: userSchema.user.email,
				accountCreated: userSchema.user.createdAt,
				balance: userSchema.user.walletBalance,
				is2faOn: userSchema.user.twoFactorEnabled,
				withdrawalAllowed: userSchema.user.isWithdrawalOn,
				isAccountActive: userSchema.user.isAccountActive,
			})
			.from(userSchema.user)
			.where(eq(userSchema.user.id, String(userId)));

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "No user found with provided id" });
		}

		return res
			.status(200)
			.json({ success: true, message: "User fetched successfully", user });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return res.status(500).json({ success: false, message: errorMessage });
	}
};
