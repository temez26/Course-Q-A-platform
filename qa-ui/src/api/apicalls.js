import { get } from "svelte/store";
import {
  userUuid,
  courseId,
  question,
  questionpage,
  questionsAndAnswers,
  updatedAnswers,
  specificQuestionId,
  userAnswer,
  questionId,
  course,
  answerpage,
  courses,
  answerId,
} from "../stores/stores.js";

const socket = new WebSocket("ws://localhost:7800/ws/");

const logSocketEvent = (event, message) =>
  console.log(`WebSocket ${event}: ${message}`);
socket.onopen = () => {
  console.log("WebSocket is connected:", socket);
};
socket.onerror = (error) => logSocketEvent("error", error);
socket.onclose = (event) => logSocketEvent("is closed with event", event);

socket.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log("response", response);

  if (response && response.message) {
    const { type, message } = response;
    console.log(`${type} fetched:`, message);

    switch (type) {
      case "getCourses":
        courses.set(message);
        break;
      case "getCourse":
        course.set(message[0]);
        break;
      case "getllm":
        console.log("Question asked successfully", message);
        question.set("");
        questionsAndAnswers.set(message);
        break;
      case "getQuestionsAndAnswers":
        response.message.length === 1
          ? updatedAnswers.set(message)
          : questionsAndAnswers.set(message);
        break;
      case "postUpvoteQuestion":
        questionsAndAnswers.set(message);
        break;
      case "postUserAnswer":
        updatedAnswers.set(message);
        break;
      case "postUpvote":
        updatedAnswers.set(message);
        break;
      default:
        console.log("Received a message without a type:", message);
    }
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

export const fetchCourses = () =>
  sendSocketMessage(createMessage("getCourses"));
export const fetchCourse = () =>
  sendSocketMessage(createMessage("getCourse", { courseId: get(courseId) }));
export const askSomething = () =>
  sendSocketMessage(
    createMessage("getllm", {
      data: {
        user_id: get(userUuid),
        question: get(question),
        courseId: get(courseId),
        page: get(questionpage),
      },
    })
  );
export const fetchQuestions = () =>
  sendSocketMessage(
    createMessage("getQuestionsAndAnswers", {
      data: { courseId: get(courseId), page: get(questionpage) },
    })
  );
export const fetchAnswers = () =>
  sendSocketMessage(
    createMessage("getQuestionsAndAnswers", {
      data: {
        courseId: get(courseId),
        questionId: get(specificQuestionId),
        page: get(answerpage),
      },
    })
  );
export const postUpvoteQuestion = (questionId) =>
  sendSocketMessage(
    createMessage("postUpvoteQuestion", {
      data: {
        user_id: get(userUuid),
        questionId: questionId,
        courseId: get(courseId),
        page: get(questionpage),
      },
    })
  );
export const postUserAnswer = () =>
  sendSocketMessage(
    createMessage("postUserAnswer", {
      data: {
        user_id: get(userUuid),
        answer: get(userAnswer),
        questionId: get(questionId),
        courseId: get(courseId),
        page: get(answerpage),
      },
    })
  );
export const postUpvoteAnswer = () =>
  sendSocketMessage(
    createMessage("postUpvote", {
      data: {
        user_id: get(userUuid),
        questionId: get(specificQuestionId),
        answer_id: get(answerId),
        courseId: get(courseId),
        page: get(answerpage),
      },
    })
  );
