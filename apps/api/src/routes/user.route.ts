import { Router } from "express";
import {
	buyOrder,
	orderHistory,
	sellOrder,
} from "../controller/order.controller";
import {
	fetchAllPosition,
	fetchPositions,
	getPriceHistory,
} from "../controller/user.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.post("/user/order/buy", authMiddleWareUser, buyOrder);
router.post("/user/order/sell", authMiddleWareUser, sellOrder);
router.get("/user/position/get", authMiddleWareUser, fetchPositions);
router.get("/user/position/get-all", authMiddleWareUser, fetchAllPosition);
router.get("/order/get-order-history", orderHistory);
router.get("/user/price/history", authMiddleWareUser, getPriceHistory);

export default router;
