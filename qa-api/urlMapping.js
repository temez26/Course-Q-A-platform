import {
  postUpvote,
  getllm,
  getCourse,
  getQuestionsAndAnswers,
  getCourses,
  postUpvoteQuestion,
  postUserAnswer,
} from "./endpoints.js";

export const handleWebSocket = async (ws) => {
  console.log("socket connected!");
  ws.on("error", function (error) {
    console.log("WebSocket error:", error);
  });
  ws.on("message", async function (message) {
    console.log("Received message:", message);
    if (typeof message === "string") {
      // Assuming the string is a JSON object that contains the type and data for the function
      const messageObj = JSON.parse(message);
      console.log("Parsed message:", messageObj);
      let result;

      switch (messageObj.type) {
        case "getllm":
          console.log("Handling getllm");
          result = await getllm(messageObj.data);
          break;
        case "postUpvote":
          console.log("Handling postUpvote");
          result = await postUpvote(messageObj.data);
          break;
        case "postUserAnswer":
          console.log("Handling postUserAnswer");
          result = await postUserAnswer(messageObj.data);
          break;
        case "postUpvoteQuestion":
          console.log("Handling postUpvoteQuestion");
          result = await postUpvoteQuestion(messageObj.data);
          break;
        case "getQuestionsAndAnswers":
          console.log("Handling getQuestionsAndAnswers");
          result = await getQuestionsAndAnswers(messageObj.data);
          break;
        case "getCourses":
          console.log("Handling getCourses");
          result = await getCourses();
          break;
        case "getCourse":
          console.log("Handling getCourse");
          result = await getCourse(messageObj.courseId);
          break;
        default:
          console.log("Invalid message type:", messageObj.type);
          result = { message: "Invalid message type" };
      }

      console.log("Sending result:", result);
      await ws.send(JSON.stringify(result));
    }
  });
  console.log("socket closed");
  ws.on("close", function (code, reason) {
    console.log("closed", code, reason);
  });
};
