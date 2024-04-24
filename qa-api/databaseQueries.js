import { sql } from "./database.js";
// INSERT QUESTIONS INTO QUESTIONS TABLE AND INSERT LLM ANSWERS TO ANSWERS TABLE
export async function insertQuestion(data) {
  return await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.courseId}) RETURNING id`;
}

export async function insertAnswer(newAnswer, questionId) {
  return await sql`INSERT INTO Answers (answer, user_id, question_id) VALUES (${newAnswer}, ${null}, ${questionId})`;
}
// GET COURSES OR GET SPECIFIC COURSE
export async function fetchCourses(courseId) {
  return courseId
    ? await sql`SELECT * FROM Courses WHERE id = ${courseId};`
    : await sql`SELECT * FROM Courses;`;
}
// FOR POST UPVOTE: Checks if a user has already upvoted a specific answer
export async function checkExistingVote(userid, answerId) {
  return await sql`SELECT * FROM UserVotes WHERE user_id = ${userid} AND answer_id = ${answerId}`;
}

// FOR POST UPVOTE: Gets the current vote count for a specific answer
export async function getVoteCount(answerId) {
  const voteCount = await sql`SELECT votes FROM Answers WHERE id = ${answerId}`;
  return voteCount[0].votes;
}

// FOR POST UPVOTE: Inserts a new vote from a user for a specific answer
export async function insertUserVote(userid, answerId) {
  await sql`INSERT INTO UserVotes (user_id, answer_id) VALUES (${userid}, ${answerId})`;
}

// FOR POST UPVOTE: Increments the vote count for a specific answer and updates the last activity timestamp
export async function incrementAnswerVotesAndUpdateActivity(answerId) {
  await sql`UPDATE Answers SET votes = votes + 1, last_activity = NOW() WHERE id = ${answerId}`;
}

// FOR POST USER ANSWER: Inserts a new answer from a user for a specific question
export async function insertUserAnswer(answer, userid, questionId) {
  const result = await sql`
      INSERT INTO Answers (answer, user_id, question_id, last_activity) 
      VALUES (${answer}, ${userid}, ${questionId}, NOW())
      RETURNING *;
    `;
  return result[0];
}
// FOR POST UPVOTE QUESTION: Updates the last activity timestamp for a specific question
export async function updateQuestionLastActivity(questionId) {
  await sql`UPDATE Questions SET last_activity = NOW() WHERE id = ${questionId}`;
}

// FOR POST UPVOTE QUESTION: Checks if a user has already upvoted a specific question
export async function checkExistingQuestionVote(userid, questionId) {
  const existingVote =
    await sql`SELECT * FROM UserVotes WHERE user_id = ${userid} AND question_id = ${questionId}`;
  return existingVote;
}

// FOR POST UPVOTE QUESTION: Gets the current vote count for a specific question
export async function getQuestionVoteCount(questionId) {
  const voteCount =
    await sql`SELECT votes FROM Questions WHERE id = ${questionId}`;
  return voteCount[0].votes;
}

// FOR POST UPVOTE QUESTION: Inserts a new vote from a user for a specific question
export async function insertUserQuestionVote(userid, questionId) {
  await sql`INSERT INTO UserVotes (user_id, question_id) VALUES (${userid}, ${questionId})`;
}

// FOR POST UPVOTE QUESTION: Increments the vote count for a specific question
export async function incrementQuestionVotes(questionId) {
  await sql`UPDATE Questions SET votes = votes + 1 WHERE id = ${questionId}`;
}

// FOR GET QUESTIONS AND ANSWERS: Gets a specific question for a specific course
export async function getSpecificQuestion(courseId, questionId) {
  const questions = await sql`
      SELECT * FROM Questions WHERE course_id = ${courseId} AND id = ${questionId}
      ORDER BY last_activity DESC;
    `;
  return questions;
}

// FOR GET QUESTIONS AND ANSWERS: Gets all questions for a specific course, with pagination
export async function getAllQuestions(courseId, questionsPerPage, currentPage) {
  const questions = await sql`
      SELECT * FROM Questions WHERE course_id = ${courseId} ORDER BY last_activity DESC LIMIT ${questionsPerPage} OFFSET ${
    currentPage * questionsPerPage
  };
    `;
  return questions;
}

// FOR GET QUESTIONS AND ANSWERS: Gets all answers for a specific question, with pagination
export async function getAnswersForQuestion(
  questionId,
  answersPerPage,
  currentPage
) {
  const answers = await sql`
      (SELECT * FROM Answers WHERE question_id = ${questionId} AND user_id IS NULL)
      UNION
      (SELECT * FROM Answers WHERE question_id = ${questionId} AND user_id IS NOT NULL ORDER BY last_activity DESC LIMIT ${answersPerPage} OFFSET ${
    currentPage * answersPerPage
  })
      ORDER BY last_activity DESC;
    `;
  return answers;
}
