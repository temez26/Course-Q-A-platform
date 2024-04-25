import {
  postUpvote,
  getllm,
  getCourse,
  getQuestionsAndAnswers,
  getCourses,
  postUpvoteQuestion,
  postUserAnswer,
} from "../functionality/endpoints.js";

export const messageHandlers = {
  getllm: async (data) => {
    await getllm(data);
    return getQuestionsAndAnswers(data);
  },
  postUpvote: async (data) => {
    await postUpvote(data);
    return getQuestionsAndAnswers({
      courseId: data.courseId,
      questionId: data.questionId,
      page: data.answerpage,
    });
  },
  postUserAnswer: async (data) => {
    await postUserAnswer(data);
    return getQuestionsAndAnswers({
      courseId: data.courseId,
      questionId: data.questionId,
      page: data.answerpage,
    });
  },
  postUpvoteQuestion: async (data) => {
    await postUpvoteQuestion(data);
    return getQuestionsAndAnswers({
      courseId: data.courseId,
      page: data.page,
    });
  },
  getQuestionsAndAnswers: getQuestionsAndAnswers,
  getCourses: getCourses,
  getCourse: async (data) => getCourse(data.courseId),
};
