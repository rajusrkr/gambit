import http from "node:http";
import dotenv from "dotenv";
import express from "express";
import { setupWS } from "./lib/server";

dotenv.config();
const app = express();
const server = http.createServer(app);

server.listen(8000, () => {
	console.log("server listening on port 8000");
});

setupWS(server);
