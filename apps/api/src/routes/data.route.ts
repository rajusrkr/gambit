import { Router } from "express";
import {
	getLatestPrices,
	getMarketById,
	getMarkets,
} from "../controller/data.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.get("/data/get-markets", authMiddleWareUser, getMarkets);
router.get("/data/get-latest-price", authMiddleWareUser, getLatestPrices);
router.get("/data/get-market-by-id", authMiddleWareUser, getMarketById);

export default router;
