import { Router } from "express";
import { buyOrder, sellOrder } from "../controller/order.controller";
import { fetchAllPosition } from "../controller/user.controller";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.post("/order/buy", authMiddleWareUser, buyOrder);
router.post("/order/sell", authMiddleWareUser, sellOrder);
router.get("/position/get-all", authMiddleWareUser, fetchAllPosition);

export default router;
