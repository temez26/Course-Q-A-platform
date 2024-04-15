import {
  getCourses,
  postQuestion,
  postAnswer,
  postUpvote,
  getQuestions,
  getAnswers,
  generateAnswer,
  getboi,
} from "./endpoints.js";

export const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/boi" }),
    fn: getboi,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getCourses" }),
    fn: getCourses,
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
    pattern: new URLPattern({ pathname: "/getQuestions" }),
    fn: getQuestions,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getAnswers" }),
    fn: getAnswers,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/generateAnswer" }),
    fn: generateAnswer,
  },
];
