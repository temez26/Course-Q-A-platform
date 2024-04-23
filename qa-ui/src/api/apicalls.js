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
} from "../stores/stores.js";

// Create a WebSocket connection
const socket = new WebSocket("ws://localhost:7800/ws/");

socket.onopen = () => {
  console.log("WebSocket is connected.");
};

socket.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

socket.onclose = (event) => {
  console.log(`WebSocket is closed with event: ${event}`);
};
socket.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log("response", response);

  if (response && response.message) {
    if (response.message.length === 1) {
      console.log("Course fetched:", response.message);
      course.set(response.message[0]);
    } else if (response.message.length > 1) {
      console.log("Questions fetched:", response.message);
      questionsAndAnswers.set(response.message);
    }
  } else {
    console.error("Error fetching data:", response.message);
  }
};

const sendSocketMessage = (message) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.log("WebSocket is not open. readyState: " + socket.readyState);

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify(message));
    });
  }
};

export const fetchCourses = () => {
  const message = {
    type: "getCourses",
  };

  sendSocketMessage(message);

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log("fetchCourses", response.message);
    courses.set(response.message);
  };
};
export const fetchCourse = async () => {
  const message = {
    type: "getCourse",
    courseId: get(courseId),
  };

  sendSocketMessage(message);
};

export const askSomething = () => {
  const message = {
    type: "askSomething",
    data: {
      user_id: get(userUuid),
      question: get(question),
      course_id: get(courseId),
    },
  };

  sendSocketMessage(message);

  socket.onmessage = () => {
    question.set("");
    fetchQuestions();
  };
};

export const fetchQuestions = () => {
  const message = {
    type: "getQuestionsAndAnswers",
    data: {
      courseId: get(courseId),
      page: get(questionpage),
    },
  };

  sendSocketMessage(message);
};

export const fetchAnswers = () => {
  const message = {
    type: "getQuestionsAndAnswers",
    data: {
      courseId: get(courseId),
      questionId: get(specificQuestionId),
      page: get(answerpage),
    },
  };

  sendSocketMessage(message);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updatedAnswers(data);
  };
};

export const postUpvoteQuestion = (questionId) => {
  const message = {
    type: "postUpvoteQuestion",
    data: {
      user_id: get(userUuid),
      question_id: questionId,
    },
  };

  sendSocketMessage(message);

  socket.onmessage = () => {
    fetchQuestions();
    fetchAnswers();
  };
};

export const postUserAnswer = () => {
  const message = {
    type: "postUserAnswer",
    data: {
      user_id: get(userUuid),
      answer: get(userAnswer),
      question_id: get(questionId),
    },
  };

  sendSocketMessage(message);

  socket.onmessage = fetchAnswers;
};
export const postUpvoteAnswer = (answerId) => {
  const message = {
    type: "postUpvote",
    data: {
      user_id: get(userUuid),
      answer_id: answerId,
    },
  };

  sendSocketMessage(message);

  socket.onmessage = fetchAnswers;
};
