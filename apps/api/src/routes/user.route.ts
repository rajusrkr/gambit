import { NextFunction, Request, Response, Router } from "express";
import { buyOrder } from "../controller/order.controller";
import { userAuth } from "../lib/better-auth";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

router.post("/user/order/buy", authMiddleWareUser, buyOrder);

async function authMiddleWareUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await userAuth.api.getSession({
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
