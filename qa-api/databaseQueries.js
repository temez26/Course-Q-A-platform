import { sql } from "./database.js";

// FOR GET COURSES
export async function fetchCourses() {
  const courses = await sql`SELECT * FROM Courses;`;
  return courses;
}
// FOR GET COURSE
export async function fetchCourse(courseId) {
  const course = await sql`SELECT * FROM Courses WHERE id = ${courseId};`;
  return course;
}
// FOR POST UPVOTE: Checks if a user has already upvoted a specific answer
export async function checkExistingVote(data) {
  const existingVote =
    await sql`SELECT * FROM UserVotes WHERE user_id = ${data.user_id} AND answer_id = ${data.answer_id}`;
  return existingVote;
}

// FOR POST UPVOTE: Gets the current vote count for a specific answer
export async function getVoteCount(answerId) {
  const voteCount = await sql`SELECT votes FROM Answers WHERE id = ${answerId}`;
  return voteCount[0].votes;
}

// FOR POST UPVOTE: Inserts a new vote from a user for a specific answer
export async function insertUserVote(data) {
  await sql`INSERT INTO UserVotes (user_id, answer_id) VALUES (${data.user_id}, ${data.answer_id})`;
}

// FOR POST UPVOTE: Increments the vote count for a specific answer
export async function incrementAnswerVotes(answerId) {
  await sql`UPDATE Answers SET votes = votes + 1 WHERE id = ${answerId}`;
}

// FOR POST UPVOTE: Updates the last activity timestamp for a specific answer
export async function updateLastActivity(answerId) {
  await sql`UPDATE Answers SET last_activity = NOW() WHERE id = ${answerId}`;
}

// FOR POST USER ANSWER: Inserts a new answer from a user for a specific question
export async function insertUserAnswer(data) {
  const result = await sql`
      INSERT INTO Answers (answer, user_id, question_id, last_activity) 
      VALUES (${data.answer}, ${data.user_id}, ${data.question_id}, NOW())
      RETURNING *;
    `;
  return result[0];
}

// FOR POST UPVOTE QUESTION: Checks if a user has already upvoted a specific question
export async function checkExistingQuestionVote(data) {
  const existingVote =
    await sql`SELECT * FROM UserVotes WHERE user_id = ${data.user_id} AND question_id = ${data.question_id}`;
  return existingVote;
}

// FOR POST UPVOTE QUESTION: Gets the current vote count for a specific question
export async function getQuestionVoteCount(questionId) {
  const voteCount =
    await sql`SELECT votes FROM Questions WHERE id = ${questionId}`;
  return voteCount[0].votes;
}

// FOR POST UPVOTE QUESTION: Inserts a new vote from a user for a specific question
export async function insertUserQuestionVote(data) {
  await sql`INSERT INTO UserVotes (user_id, question_id) VALUES (${data.user_id}, ${data.question_id})`;
}

// FOR POST UPVOTE QUESTION: Increments the vote count for a specific question
export async function incrementQuestionVotes(questionId) {
  await sql`UPDATE Questions SET votes = votes + 1 WHERE id = ${questionId}`;
}

// FOR POST UPVOTE QUESTION: Updates the last activity timestamp for a specific question
export async function updateQuestionLastActivity(questionId) {
  await sql`UPDATE Questions SET last_activity = NOW() WHERE id = ${questionId}`;
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
