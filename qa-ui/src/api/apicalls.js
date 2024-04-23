import { get } from "svelte/store";
import { fetchData } from "./helper.js";
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
} from "../stores/stores.js";

export const fetchCourse = async () => {
  const result = await fetchData(
    `/api/getCourse?courseId=${get(courseId)}`,
    "GET"
  );
  course.set(result[0]);
};

export const askSomething = () =>
  fetchData(
    "/api/",
    "POST",
    {
      user_id: get(userUuid),
      question: get(question),
      course_id: get(courseId),
    },
    null
  ).then(() => {
    question.set("");
    fetchQuestions();
  });

export const fetchQuestions = () =>
  fetchData(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&page=${get(
      questionpage
    )}`,
    "GET",
    null,
    questionsAndAnswers
  );

export const fetchAnswers = () =>
  fetchData(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&questionId=${get(
      specificQuestionId
    )}&page=${get(answerpage)}`,
    "GET",
    null,
    updatedAnswers
  );

export const postUpvoteQuestion = (questionId) =>
  fetchData(
    "/api/postUpvoteQuestion",
    "POST",
    {
      user_id: get(userUuid),
      question_id: questionId,
    },
    null
  ).then(() => {
    fetchQuestions();
    fetchAnswers();
  });

export const postUserAnswer = () =>
  fetchData(
    "/api/postUserAnswer",
    "POST",
    {
      user_id: get(userUuid),
      answer: get(userAnswer),
      question_id: get(questionId),
    },
    null
  ).then(fetchAnswers);

export const postUpvoteAnswer = (answerId) =>
  fetchData(
    "/api/postUpvote",
    "POST",
    {
      user_id: get(userUuid),
      answer_id: answerId,
    },
    null
  ).then(fetchAnswers);

export const fetchCourses = () => fetchData("/api/getCourses", "GET");

export const selectCourse = (id, courseIdStore) => {
  courseIdStore.set(id);
  window.location.href = `/course`;
};
