import {
  createResponse,
  withErrorHandling,
  parseJson,
  processAnswers,
} from "./helper.js";
import {
  insertQuestion,
  insertAnswer,
  fetchCourses,
  checkExistingVote,
  getVoteCount,
  insertUserVote,
  incrementAnswerVotesAndUpdateActivity,
  insertUserAnswer,
  updateQuestionLastActivity,
  checkExistingQuestionVote,
  getQuestionVoteCount,
  insertUserQuestionVote,
  incrementQuestionVotes,
  getSpecificQuestion,
  getAllQuestions,
  getAnswersForQuestion,
} from "./databaseQueries.js";
// HANDLING THE QUESTION INSERTION AND ALSO THE CALL TO THE LLM API
export async function getllm(request) {
  const data = await parseJson(request);
  const [{ id: questionId }] = await insertQuestion(data);
  queueMicrotask(() => handleLLMApi(data, questionId));
  return createResponse({
    questionId,
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
export const getCourse = withErrorHandling(async (request) => {
  const courseId = new URL(request.url).searchParams.get("courseId");
  const course = await fetchCourses(courseId);
  return createResponse(course, "Fetching course successful");
});
// HANDLING THE UPVOTE OF AN ANSWER
export const postUpvote = withErrorHandling(async (request) => {
  const data = await parseJson(request);
  const existingVote = await checkExistingVote(data);
  if (existingVote.length > 0) {
    return createResponse(
      { votes: await getVoteCount(data.answer_id) },
      "User already voted for this answer",
      220
    );
  }
  await insertUserVote(data);
  await incrementAnswerVotesAndUpdateActivity(data.answer_id);
  return createResponse(
    { votes: await getVoteCount(data.answer_id) },
    "Posting upvote successful"
  );
});

// HANDLING THE POSTING OF AN ANSWER
export const postUserAnswer = withErrorHandling(async (request) => {
  const data = await parseJson(request);
  await insertUserAnswer(data);
  await updateQuestionLastActivity(data.question_id);
  return createResponse("OK", "Success posting user answer");
});

// HANDLING THE UPVOTE OF A QUESTION
export const postUpvoteQuestion = withErrorHandling(async (request) => {
  const data = await parseJson(request);
  if ((await checkExistingQuestionVote(data)).length > 0) {
    return createResponse(
      { votes: await getQuestionVoteCount(data.question_id) },
      "user already voted for this question",
      220
    );
  }
  await insertUserQuestionVote(data);
  await incrementQuestionVotes(data.question_id);
  await updateQuestionLastActivity(data.question_id);
  return createResponse(
    { votes: await getQuestionVoteCount(data.question_id) },
    "Handling votes successful"
  );
});

// HANDLING THE GETTING OF QUESTIONS AND ANSWERS
export const getQuestionsAndAnswers = withErrorHandling(async (request) => {
  const url = new URL(request.url);
  const courseId = url.searchParams.get("courseId");
  const questionId = url.searchParams.get("questionId");
  const currentPage = Number(url.searchParams.get("page")) || 0;
  const answersPerPage = 20;
  const questionsPerPage = 20;

  const questions = questionId
    ? await getSpecificQuestion(courseId, questionId)
    : await getAllQuestions(courseId, questionsPerPage, currentPage);

  await Promise.all(
    questions.map(async (question) => {
      question.answers = await getAnswersForQuestion(
        question.id,
        answersPerPage,
        currentPage
      );
    })
  );

  // Process answers
  const processedQuestions = await processAnswers(questions);

  return createResponse(
    processedQuestions,
    "Fetching questions and answers successful"
  );
});
