import ws from "k6/ws";
import { check } from "k6";

export let options = {
  vus: 10, // virtual users
  duration: "5s", //  seconds
  summaryTrendStats: ["avg", "p(99)"], // percentiles
};

export default function () {
  const url = "ws://localhost:7800/ws/"; // replace with your WebSocket endpoint
  const params = { tags: { my_tag: "hello" } };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", () => {
      console.log("connected");
      socket.send(
        JSON.stringify({ type: "getCourse", data: { courseId: "1" } })
      );
    });
    socket.on("message", (data) => {
      console.log(`Message received: ${data}`);
      const response = JSON.parse(data);
      check(response, {
        "received getCourse response": (r) => r.type === "getCourse",
      });
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
