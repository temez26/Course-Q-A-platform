import { get } from "svelte/store";
import { apiCall } from "./helper.js";
import {
  userUuid,
  courseId,
  question,
  coursepage,
  questionsAndAnswers,
  currentPage,
  updatedAnswers,
  specificQuestionId,
  userAnswer,
  questionId,
  course,
} from "../stores/stores.js";

const fetchData = async (url, method, data, store) => {
  const result = await apiCall(url, method, data);
  if (store) {
    store.set(result);
  }
  return result;
};

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

export const fetchQuestions = () => {
  fetchData(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&page=${get(
      coursepage
    )}`,
    "GET",
    null
  ).then((jsonData) => {
    questionsAndAnswers.set(
      jsonData
        .map((qna) => {
          return {
            ...qna,
            answers: qna.answers,
            votes: qna.votes,
            last_activity: new Date(qna.last_activity).getTime(),
          };
        })
        .sort((a, b) => b.last_activity - a.last_activity)
    );
  });
};

export const fetchAnswers = () =>
  fetchData(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&questionId=${get(
      specificQuestionId
    )}&page=${get(currentPage)}`,
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
