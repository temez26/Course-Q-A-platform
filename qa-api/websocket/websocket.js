import { messageHandlers } from "./websocketFunctions.js";

export const handleWebSocket = async (ws) => {
  ws.on("error", (error) => console.log("WebSocket error:", error));
  ws.on("message", async (message) => {
    try {
      //console.log("Received message:", message);
      if (typeof message === "string") {
        const messageObj = JSON.parse(message);
        //console.log("Parsed message:", messageObj);
        let result;

        if (messageHandlers[messageObj.type]) {
          //console.log(`Handling ${messageObj.type}`);
          result = await messageHandlers[messageObj.type](messageObj.data);
        } else {
          //console.log("Invalid message type:", messageObj.type);
          result = { message: "Invalid message type" };
        }

        const resultWithMessageType = {
          ...result,
          type: messageObj.type,
        };
        //console.log("Sending result:", resultWithMessageType);
        await ws.send(JSON.stringify(resultWithMessageType));
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
  ws.on("close", (code, reason) => console.log("closed", code, reason));
};
