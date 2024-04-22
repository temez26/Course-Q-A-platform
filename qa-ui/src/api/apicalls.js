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

// FOR THE COURSE PAGE COMPONENT
export const askSomething = async () => {
  const data = {
    user_id: get(userUuid),
    question: get(question),
    course_id: get(courseId),
  };

  await apiCall("/api/", "POST", data);

  question.set("");

  fetchQuestions();
};

export const fetchQuestions = async () => {
  const jsonData = await apiCall(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&page=${get(
      coursepage
    )}`,
    "GET"
  );

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
};

export const fetchAnswers = async () => {
  const jsonData = await apiCall(
    `/api/getQuestionsAndAnswers?courseId=${get(courseId)}&questionId=${get(
      specificQuestionId
    )}&page=${get(currentPage)}`,
    "GET"
  );

  updatedAnswers.set(jsonData);
};
export const postUpvoteQuestion = async (questionId) => {
  await apiCall("/api/postUpvoteQuestion", "POST", {
    user_id: get(userUuid),
    question_id: questionId,
  });

  fetchAnswers();
  fetchQuestions();
};

export async function postUserAnswer() {
  const data = {
    user_id: get(userUuid),
    answer: get(userAnswer),
    question_id: get(questionId),
  };

  await apiCall("/api/postUserAnswer", "POST", data);

  const qnaList = get(questionsAndAnswers);
  for (let qna of qnaList) {
    if (qna.id === questionId) {
      qna.last_activity = new Date();

      qna.answers.sort((a, b) => {
        const aLastActivity = new Date(a.last_activity);
        const bLastActivity = new Date(b.last_activity);
        return bLastActivity - aLastActivity;
      });
    }
  }
  fetchAnswers();
}
export async function postUpvoteAnswer(answerId) {
  const data = {
    user_id: get(userUuid),
    answer_id: answerId,
  };
  const response = await apiCall("/api/postUpvote", "POST", data);

  const qnaList = get(questionsAndAnswers);
  for (let qna of qnaList) {
    for (let answer of qna.answers) {
      if (answer.id === answerId) {
        answer.last_activity = new Date();
      }
    }
  }
  fetchAnswers();
}
export async function fetchCourse() {
  const result = await apiCall(
    `/api/getCourse?courseId=${get(courseId)}`,
    "GET"
  );

  course.set(result[0]);
}

// FOR THE COURSES COMPONENT

export async function fetchCourses() {
  const courses = await apiCall("/api/getCourses", "GET");

  return courses;
}

export function selectCourse(id, courseIdStore) {
  courseIdStore.set(id);
  window.location.href = `/course`;
}
