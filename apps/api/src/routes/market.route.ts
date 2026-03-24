import { fromNodeHeaders } from "better-auth/node";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import {
	createMarket,
	fetchFootball,
	getMarkets,
	marketById,
} from "../controller/market.controller";
import { adminAuth } from "../lib/better-auth";

const router = Router();

router.get("/fetch-football", authMiddleWare, fetchFootball);
router.post("/create-market", authMiddleWare, createMarket);
router.get("/get-market", getMarkets);
router.get("/get-market-by-id", marketById);

async function authMiddleWare(req: Request, res: Response, next: NextFunction) {
	const session = await adminAuth.api.getSession({
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
