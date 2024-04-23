import {
  postUpvote,
  getllm,
  getCourse,
  getQuestionsAndAnswers,
  getCourses,
  postUpvoteQuestion,
  postUserAnswer,
} from "./endpoints.js";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";

const handleWebSocket = async (request, fn) => {
  const { conn, r: bufReader, w: bufWriter, headers } = request;
  acceptWebSocket({
    conn,
    bufReader,
    bufWriter,
    headers,
  }).then(async (sock) => {
    console.log("socket connected!");

    try {
      for await (const ev of sock) {
        if (typeof ev === "string") {
          // Assuming the string is a JSON object that contains the parameters for the function
          const params = JSON.parse(ev);

          const result = await fn(...params);
          await sock.send(JSON.stringify(result));
        } else if (isWebSocketCloseEvent(ev)) {
          const { code, reason } = ev;
          console.log("closed", code, reason);
        }
      }
    } catch (err) {
      console.error(`failed to receive frame: ${err}`);

      if (!sock.isClosed) {
        await sock.close(1000).catch(console.error);
      }
    }
  });
};

export const urlMapping = [
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/" }),
    fn: (request) => handleWebSocket(request, getllm),
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getCourses" }),
    fn: (request) => handleWebSocket(request, getCourses),
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getCourse" }),
    fn: (request) => handleWebSocket(request, getCourse),
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postUpvoteQuestion" }),
    fn: (request) => handleWebSocket(request, postUpvoteQuestion),
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postUserAnswer" }),
    fn: (request) => handleWebSocket(request, postUserAnswer),
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postUpvote" }),
    fn: (request) => handleWebSocket(request, postUpvote),
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getQuestionsAndAnswers" }),
    fn: (request) => handleWebSocket(request, getQuestionsAndAnswers),
  },
];
