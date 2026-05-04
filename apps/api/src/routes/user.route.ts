import { Router } from "express";
import { buyOrder, sellOrder } from "../controller/order.controller";
import {
	changeAccountStatus,
	changeAccountWithdrawalStatus,
	dummyUsers,
	fetchAllPosition,
} from "../controller/user.controller";
import { authMiddleWareAdmin } from "../lib/helpers/middlewares/admin-auth";
import { authMiddleWareUser } from "../lib/helpers/middlewares/user-auth";

const router = Router();

router.post("/order/buy", authMiddleWareUser, buyOrder);
router.post("/order/sell", authMiddleWareUser, sellOrder);
router.get("/position/get-all", authMiddleWareUser, fetchAllPosition);
// Admin only
router.patch(
	"/withdrawal-status",
	authMiddleWareAdmin,
	changeAccountWithdrawalStatus,
);

router.post("/create", authMiddleWareAdmin, dummyUsers);


router.patch("/account-status", authMiddleWareAdmin, changeAccountStatus)

export default router;
