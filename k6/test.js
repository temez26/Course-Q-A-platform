import ws from "k6/ws";
import { check } from "k6";

export let options = {
  vus: 100,
  duration: "10s",
  summaryTrendStats: ["avg", "p(99)"],
};

function getRandomQuestion() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getRandomCourseId() {
  return Math.floor(Math.random() * 8) + 1;
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
      socket.send(JSON.stringify({ type: "getCourses", data: {} }));
      socket.send(
        JSON.stringify({
          type: "getCourse",
          data: { courseId: getRandomCourseId().toString() },
        })
      );
      socket.send(
        JSON.stringify({
          type: "getllm",
          data: {
            userUuid: "5a4a6414-90c0-4d9b-be19-99aa66ab75a0",
            question: getRandomQuestion(),
            courseId: getRandomCourseId().toString(),
          },
        })
      );
    });

    socket.on("message", (data) => {
      const response = JSON.parse(data);
      if (response.type === "getCourses") {
        check(response, {
          "received getCourses response": (r) => r.type === "getCourses",
        });
      } else if (response.type === "getCourse") {
        check(response, {
          "received getCourse response": (r) => r.type === "getCourse",
        });
      } else if (response.type === "getllm") {
        check(response, {
          "received getllm response": (r) => r.type === "getllm",
        });
      }

      // Add more checks for the other endpoints here...
    });
    socket.on("close", () => console.log("disconnected"));
    socket.on("error", (e) => console.log(`Error: ${e.error()}`));
    socket.setTimeout(() => {
      console.log("2 seconds passed, closing the socket");
      socket.close();
    }, 2000);
  });

  check(res, { "status is 101": (r) => r && r.status === 101 });
}
