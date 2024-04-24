import { get } from "svelte/store";
import {
  userUuid,
  courseId,
  question,
  page,
  questionsAndAnswers,
  updatedAnswers,
  userAnswer,
  questionId,
  course,
  courses,
  answerId,
} from "../stores/stores.js";

const stores = {
  userUuid,
  question,
  courseId,
  page,
  userAnswer,
  questionId,
  answerId,
};
console.log(stores);
const socket = new WebSocket("ws://localhost:7800/ws/");

const logSocketEvent = (event, message) =>
  console.log(`WebSocket ${event}: ${message}`);
socket.onopen = () => logSocketEvent("is connected", socket);
socket.onerror = (error) => logSocketEvent("error", error);
socket.onclose = (event) => logSocketEvent("is closed with event", event);

const setResponse = (type, message) => {
  const setters = {
    getCourses: () => courses.set(message),
    getCourse: () => course.set(message[0]),
    getllm: () => {
      questionsAndAnswers.set(message);
    },
    getQuestionsAndAnswers: () =>
      message.length === 1
        ? updatedAnswers.set(message)
        : questionsAndAnswers.set(message),
    postUpvoteQuestion: () => questionsAndAnswers.set(message),
    postUserAnswer: () => updatedAnswers.set(message),
    postUpvote: () => updatedAnswers.set(message),
  };

  return setters[type]
    ? setters[type]()
    : console.log("Received a message without a type:", message);
};

socket.onmessage = (event) => {
  const response = JSON.parse(event.data);
  logSocketEvent("response", response);

  if (response && response.message) {
    const { type, message } = response;
    logSocketEvent(`${type} fetched`, message);
    setResponse(type, message);
  } else {
    console.error("Error fetching data:", response.message);
  }
};

const createMessage = (type, data = {}) => ({ type, ...data });

const sendSocketMessage = (message) => {
  const send = () => socket.send(JSON.stringify(message));
  socket.readyState === WebSocket.OPEN
    ? send()
    : socket.addEventListener("open", send);
};

const send = (type, data = {}) =>
  sendSocketMessage(createMessage(type, { data }));

const getData = (...keys) => {
  let data = {};

  keys.forEach((key) => {
    data[key] = get(stores[key]);
  });
  console.log(data);
  return data;
};
export const fetchCourses = () => send("getCourses");
export const fetchCourse = () => send("getCourse", getData("courseId"));
export const askSomething = () =>
  send("getllm", getData("userUuid", "question", "courseId", "page"));
export const fetchQuestions = () =>
  send("getQuestionsAndAnswers", getData("courseId", "page"));
export const fetchAnswers = () =>
  send("getQuestionsAndAnswers", getData("courseId", "questionId", "page"));
export const postUpvoteQuestion = () =>
  send(
    "postUpvoteQuestion",
    getData("userUuid", "courseId", "page", "questionId")
  );
export const postUserAnswer = () =>
  send(
    "postUserAnswer",
    getData("userUuid", "userAnswer", "questionId", "courseId", "page")
  );
export const postUpvoteAnswer = () =>
  send(
    "postUpvote",
    getData("userUuid", "questionId", "answerId", "courseId", "page")
  );
