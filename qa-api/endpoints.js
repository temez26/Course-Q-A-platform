import { createResponse, withErrorHandling, processAnswers } from "./helper.js";
import {
  insertQuestion,
  insertAnswer,
  fetchCourses,
  checkExistingVote,
  insertUserVote,
  incrementAnswerVotesAndUpdateActivity,
  insertUserAnswer,
  updateQuestionLastActivity,
  checkExistingQuestionVote,
  insertUserQuestionVote,
  incrementQuestionVotes,
  getSpecificQuestion,
  getAllQuestions,
  getllmAnswersForQuestion,
  getHumanAnswersForQuestion,
} from "./databaseQueries.js";
// HANDLING THE QUESTION INSERTION AND ALSO THE CALL TO THE LLM API
export async function getllm(request) {
  const data = request;
  const [{ id: questionId }] = await insertQuestion(
    data.question,
    data.userUuid,
    data.courseId
  );
  queueMicrotask(() => handleLLMApi(data, questionId));
  return createResponse({
    questionId,
    data,
    message: "Question inserted successfully",
  });
}
async function handleLLMApi(data, questionId) {
  const fetchPromises = Array(3)
    .fill()
    .map(() =>
      fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    );

  const responses = await Promise.all(fetchPromises);

  for (const response of responses) {
    if (response.ok) {
      const [{ generated_text: newAnswer }] = await response.json();
      await insertAnswer(newAnswer, questionId);
    } else {
      console.error(`Error: ${await response.text()}`);
    }
  }
}
// GETS ALL COURSES
export async function getCourses() {
  try {
    const courses = await fetchCourses();
    return createResponse(courses, "Fetching courses successful");
  } catch (error) {
    return createResponse(null, "Error fetching courses");
  }
}
// GETS SPECIFIC COURSE
export const getCourse = withErrorHandling(async (courseId) => {
  const course = await fetchCourses(courseId);
  return createResponse(course, "Fetching course successful");
});
// HANDLING THE UPVOTE OF AN ANSWER
export const postUpvote = withErrorHandling(async (request) => {
  const data = request;

  const existingVote = await checkExistingVote(data.userUuid, data.answerId);
  if (existingVote.length > 0) {
    return createResponse(
      { message: "User already voted for this answer" },
      "User already voted for this answer",
      220
    );
  }
  await insertUserVote(data.userUuid, data.answerId);
  await incrementAnswerVotesAndUpdateActivity(data.answerId);
  return createResponse(
    { message: "Posting upvote successful" },
    "Posting upvote successful"
  );
});

// HANDLING THE POSTING OF AN ANSWER
export const postUserAnswer = withErrorHandling(async (request) => {
  const data = request;
  await insertUserAnswer(data.userAnswer, data.userUuid, data.questionId);
  await updateQuestionLastActivity(data.questionId);
  return createResponse("Posting answer successful");
});

// HANDLING THE UPVOTE OF A QUESTION
export const postUpvoteQuestion = withErrorHandling(async (request) => {
  const data = request;

  if (
    (await checkExistingQuestionVote(data.userUuid, data.questionId)).length > 0
  ) {
    return createResponse({ message: "User already voted for this question" });
  }
  await insertUserQuestionVote(data.userUuid, data.questionId);
  await incrementQuestionVotes(data.questionId);
  await updateQuestionLastActivity(data.questionId);
  return createResponse({ message: "Posting upvote successful" });
});

// HANDLING THE GETTING OF QUESTIONS AND ANSWERS
export const getQuestionsAndAnswers = withErrorHandling(async (messageData) => {
  const courseId = messageData.courseId;
  const questionId = messageData.questionId;
  const currentPage = messageData.page || messageData.answerpage || 0;
  const answersPerPage = 20;
  const questionsPerPage = 20;

  let questions = questionId
    ? await getSpecificQuestion(courseId, questionId)
    : await getAllQuestions(courseId, questionsPerPage, currentPage);

  await Promise.all(
    questions.map(async (question) => {
      question.llmAnswers = await getllmAnswersForQuestion(question.id);
      question.humanAnswers = await getHumanAnswersForQuestion(
        question.id,
        answersPerPage,
        currentPage
      );
    })
  );

  // Sort questions by last_activity
  questions.sort((a, b) => b.last_activity - a.last_activity);

  return createResponse(questions, "Fetching questions and answers successful");
});
