import { get } from "svelte/store";
import * as stores from "../stores/stores.js";
import socket, { sendSocketMessage } from "./websocket.js";

const setResponse = (type, message) => {
  const setters = {
    getCourses: () => stores.courses.set(message),
    getCourse: () => stores.course.set(message[0]),
    getllm: () => stores.questionsAndAnswers.set(message),
    getQuestionsAndAnswers: () => {
      stores.updatedAnswers.set(message);
      stores.questionsAndAnswers.set(message);
    },
    postUpvoteQuestion: () => stores.questionsAndAnswers.set(message),
    postUserAnswer: () => stores.updatedAnswers.set(message),
    postUpvote: () => stores.updatedAnswers.set(message),
  };

  return setters[type]
    ? setters[type]()
    : console.log("Received a message without a type:", message);
};

socket.onmessage = (event) => {
  const response = JSON.parse(event.data);

  if (response && response.message) {
    const { type, message } = response;
    setResponse(type, message);
  } else {
    console.error("Error fetching data:", response.message);
  }
};

const createMessage = (type, data = {}) => ({ type, data });

const send = (type, data = {}) => sendSocketMessage(createMessage(type, data));

const getData = (...keys) =>
  keys.reduce((data, key) => ({ ...data, [key]: get(stores[key]) }), {});

export const fetchCourses = () => send("getCourses");
export const fetchCourse = () => send("getCourse", getData("courseId"));
export const askSomething = () =>
  send("getllm", getData("userUuid", "question", "courseId", "page"));
export const fetchQuestions = () =>
  send("getQuestionsAndAnswers", getData("courseId", "page"));
export const fetchAnswers = () =>
  send(
    "getQuestionsAndAnswers",
    getData("courseId", "questionId", "answerpage")
  );
export const postUpvoteQuestion = () =>
  send(
    "postUpvoteQuestion",
    getData("userUuid", "courseId", "page", "questionId")
  );
export const postUserAnswer = () =>
  send(
    "postUserAnswer",
    getData("userUuid", "userAnswer", "questionId", "courseId", "answerpage")
  );
export const postUpvoteAnswer = () =>
  send(
    "postUpvote",
    getData("userUuid", "questionId", "answerId", "courseId", "answerpage")
  );
