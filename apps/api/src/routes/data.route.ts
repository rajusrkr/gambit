import { Router } from "express";
import {
	getLatestPrices,
	getMarketById,
	getMarkets,
} from "../controller/data.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.get("/get-markets", getMarkets);
router.get("/get-latest-price", authMiddleWareUser, getLatestPrices);
// User only
router.get("/get-market-by-id", authMiddleWareUser, getMarketById);

export default router;
