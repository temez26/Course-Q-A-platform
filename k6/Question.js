import ws from "k6/ws";
import { check } from "k6";

export let options = {
  vus: 50,
  duration: "10s",
  summaryTrendStats: ["avg", "p(99)"],
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function getRandomQuestionId(min = 1, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function () {
  const url = "ws://localhost:7800/ws/";
  const params = { tags: { my_tag: "hello" } };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", () => {
      console.log("connected");
      check(
        {},
        {
          "WebSocket connection established": (r) => true,
        }
      );

      for (let i = 0; i < 10; i++) {
        const userUuid = uuidv4();
        const questionId = getRandomQuestionId().toString();
        socket.send(
          JSON.stringify({
            type: "postUpvoteQuestion",
            data: { userUuid, questionId },
          })
        );
      }
    });

    socket.on("message", (data) => {
      console.log(`Message received: ${data}`);
      const response = JSON.parse(data);
      if (response.type === "postUpvoteQuestion") {
        check(response, {
          "received postUpvoteQuestion response": (r) =>
            r.type === "postUpvoteQuestion",
        });
      }
    });

    socket.on("error", (e) => console.log(`Error: ${e.error()}`));
    socket.setTimeout(() => {
      console.log("2 seconds passed, closing the socket");
      socket.close();
    }, 2000);
  });

  check(res, { "status is 101": (r) => r && r.status === 101 });
}
