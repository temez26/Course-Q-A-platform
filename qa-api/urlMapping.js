import {
  getCourses,
  postUpvote,
  getllm,
  getCourse,
  getQuestionsAndAnswers,
  getUpvotes,
  postUpvoteQuestion,
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
    pattern: new URLPattern({ pathname: "/postUpvoteQuestion" }),
    fn: postUpvoteQuestion,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/postUpvote" }),
    fn: postUpvote,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getUpvotes" }),
    fn: getUpvotes,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/getQuestionsAndAnswers" }),
    fn: getQuestionsAndAnswers,
  },
];
