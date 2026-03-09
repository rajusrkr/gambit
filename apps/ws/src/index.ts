import express from "express";
import { setUpWS } from "./lib/socket";
import http from "http";
const app = express();
const server = http.createServer(app);

server.listen(8000, () => {
  console.log("Server listening on port 8000");
});

setUpWS(server);
