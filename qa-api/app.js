import { WebSocketServer } from "./deps.js";
import { handleWebSocket } from "./urlMapping.js";

const portConfig = { port: 7777, hostname: "0.0.0.0" };
const wss = new WebSocketServer(portConfig.port);

wss.on("connection", handleWebSocket);
