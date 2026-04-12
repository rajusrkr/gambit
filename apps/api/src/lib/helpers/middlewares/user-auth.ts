import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { userAuth } from "../../better-auth";

export async function authMiddleWareUser(
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
