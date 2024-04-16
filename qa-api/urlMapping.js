import {
  getCourses,
  postQuestion,
  postAnswer,
  postUpvote,
  getllm,
  getCourse,
  getQuestionsAndAnswers,
} from "./endpoints.js";

export const urlMapping = [
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/" }),
    fn: getllm,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getCourses" }),
    fn: getCourses,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getCourse" }),
    fn: getCourse,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postQuestion" }),
    fn: postQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postAnswer" }),
    fn: postAnswer,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postUpvote" }),
    fn: postUpvote,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getQuestionsAndAnswers" }),
    fn: getQuestionsAndAnswers,
  },
];
