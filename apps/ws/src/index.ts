import dotenv from "dotenv"
import { setupWS } from "./lib/server";
import express from "express";
import http from "http";

dotenv.config()
const app = express();
const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server listening on port 8000");
});

setupWS(server);
