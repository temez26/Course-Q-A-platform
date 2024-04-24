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
      const messageObj = JSON.parse(message);
      console.log("Parsed message:", messageObj);
      let result;

      switch (messageObj.type) {
        case "getllm":
          console.log("Handling getllm");
          await getllm(messageObj.data);
          result = await getQuestionsAndAnswers(messageObj.data);
          break;
        case "postUpvote":
          console.log("Handling postUpvote");
          await postUpvote(messageObj.data);
          result = await getQuestionsAndAnswers({
            courseId: messageObj.data.courseId,
            questionId: messageObj.data.questionId,
            page: messageObj.data.page,
          });
          break;
        case "postUserAnswer":
          console.log("Handling postUserAnswer");
          await postUserAnswer(messageObj.data);
          result = await getQuestionsAndAnswers({
            courseId: messageObj.data.courseId,
            questionId: messageObj.data.questionId,
            page: messageObj.data.page,
          });
          break;
        case "postUpvoteQuestion":
          console.log("Handling postUpvoteQuestion");
          await postUpvoteQuestion(messageObj.data);
          result = await getQuestionsAndAnswers({
            courseId: messageObj.data.courseId,
            page: messageObj.data.page,
          });
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
      const resultWithMessageType = {
        ...result,
        type: messageObj.type,
      };
      console.log("Sending result:", resultWithMessageType);
      await ws.send(JSON.stringify(resultWithMessageType));
    }
  });
  console.log("socket closed");
  ws.on("close", function (code, reason) {
    console.log("closed", code, reason);
  });
};
