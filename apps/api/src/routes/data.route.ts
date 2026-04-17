import { Router } from "express";
import {
	getLatestPrices,
	getMarketById,
	getPaginatedMarketQueryData,
} from "../controller/data.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.get("/markets", getPaginatedMarketQueryData);
router.get("/get-latest-price", authMiddleWareUser, getLatestPrices);
// User only
router.get("/get-market-by-id", authMiddleWareUser, getMarketById);

export default router;
