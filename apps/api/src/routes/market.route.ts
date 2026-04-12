import { fromNodeHeaders } from "better-auth/node";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import {
	createMarket,
	deleteMarket,
	fetchFootball,
} from "../controller/market.controller";
import { adminAuth } from "../lib/better-auth";
import { authMiddleWareAdmin } from "../lib/helpers/middlewares/admin-auth";

const router = Router();

router.get("/fetch-football", authMiddleWareAdmin, fetchFootball);
router.post("/create-market", authMiddleWareAdmin, createMarket);
router.delete("/delete", authMiddleWareAdmin, deleteMarket);

export default router;
