import { Router } from "express";
import {
	getDiscussion,
	getLatestPrices,
	getMarketById,
	getPaginatedMarketQueryData,
	getPositionByMarketId,
	getPriceHistory,
	orderHistory,
} from "../controller/data.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.get("/markets", getPaginatedMarketQueryData);
router.get("/get-latest-price", authMiddleWareUser, getLatestPrices);
// User only
router.get("/market-by-id", authMiddleWareUser, getMarketById);
router.get("/position", authMiddleWareUser, getPositionByMarketId);
router.get("/price-history", authMiddleWareUser, getPriceHistory);
router.get("/market-discussions", authMiddleWareUser, getDiscussion);
router.get("/order-history", authMiddleWareUser, orderHistory)

export default router;
