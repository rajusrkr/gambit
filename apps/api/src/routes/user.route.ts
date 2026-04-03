import { fromNodeHeaders } from "better-auth/node";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import {
	buyOrder,
	orderHistory,
	sellOrder,
} from "../controller/order.controller";
import {
	fetchLatestPrice,
	fetchPositions,
	getPriceHistory,
} from "../controller/user.controller";
import { userAuth } from "../lib/better-auth";

const router = Router();

router.post("/user/order/buy", authMiddleWareUser, buyOrder);
router.post("/user/order/sell", authMiddleWareUser, sellOrder);
router.get("/user/position/get", authMiddleWareUser, fetchPositions);
router.get("/user/price/latest-prices", authMiddleWareUser, fetchLatestPrice);
router.get("/order/get-order-history", orderHistory);
router.get("/user/price/history", authMiddleWareUser, getPriceHistory);

async function authMiddleWareUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const session = await userAuth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	if (session) {
		// @ts-expect-error, attach the user
		req.user = session.user;
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}

export default router;
