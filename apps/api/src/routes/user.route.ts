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

router.post("/order/buy", authMiddleWareUser, buyOrder);
router.post("/order/sell", authMiddleWareUser, sellOrder);
router.get("/position/get", authMiddleWareUser, fetchPositions);
router.get("/position/get-all", authMiddleWareUser, fetchAllPosition);
// TODO: Change this route to data route
router.get("/order/get-order-history", orderHistory);
router.get("/price/history", authMiddleWareUser, getPriceHistory);

export default router;
