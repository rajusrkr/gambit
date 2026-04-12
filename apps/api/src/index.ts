import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { adminAuth, userAuth } from "./lib/better-auth";

const app = express();

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"http://localhost:5175",
		],
		methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
		credentials: true,
	}),
);

app.all("/api/admin/auth/*splat", toNodeHandler(adminAuth));
app.all("/api/user/auth/*splat", toNodeHandler(userAuth));

app.use(express.json());

app.listen(3333, () => {
	console.log("API server listening on port: 3333");
});

import marketRouter from "./routes/market.route";

app.use("/api/v0/market", marketRouter);

import userRouter from "./routes/user.route";

app.use("/api/v0", userRouter);

import dataRouter from "./routes/data.route";

app.use("/api/v0/market", dataRouter);
