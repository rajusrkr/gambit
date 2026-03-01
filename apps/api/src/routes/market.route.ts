import { NextFunction, Request, Response, Router } from "express";
import { createMarket, fetchFootball, getMarkets } from "../controller/market.controller";
import { adminAuth } from "../lib/better-auth";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

router.get("/fetch-football", authMiddleWare, fetchFootball);
router.post("/create-market", authMiddleWare, createMarket);
router.get("/get-market", getMarkets)

async function authMiddleWare(req: Request, res: Response, next: NextFunction) {
  const session = await adminAuth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (session) {
    // @ts-ignore, attach the user
    req.user = session.user;
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

export default router;
