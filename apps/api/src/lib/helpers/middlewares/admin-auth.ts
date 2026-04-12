import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { adminAuth } from "../../better-auth";

export async function authMiddleWareAdmin(
	req: Request,
	res: Response,
	next: NextFunction,
) {
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
