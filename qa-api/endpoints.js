import { sql } from "./database.js";
import {
  fetchCourses,
  fetchCourse,
  checkExistingVote,
  getVoteCount,
  insertUserVote,
  incrementAnswerVotes,
  updateLastActivity,
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
  const data = await request.json();
  let result =
    await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.course_id}) RETURNING id`;
  const questionId = result[0].id;

  queueMicrotask(() => handleLLMApi(data, questionId));

  return new Response(
    JSON.stringify({
      questionId: questionId,
      message: "Question inserted successfully",
    }),
    {
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
    }
  );
}

async function handleLLMApi(data, questionId) {
  let allAnswers = [];

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
      const jsonData = await response.json();
      const newAnswer = jsonData[0].generated_text;
      allAnswers.push(newAnswer);
      await sql`INSERT INTO Answers (answer, user_id, question_id) VALUES (${newAnswer}, ${null}, ${questionId})`;
    } else {
      console.error(`Error: ${await response.text()}`);
    }
  }
}
// GETS ALL COURSES
export async function getCourses() {
  try {
    const courses = await fetchCourses();
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    const body = "Error fetching courses";
    return new Response(JSON.stringify(body), { status: 500 });
  }
}

// GETS SPECIFIC COURSE
export async function getCourse(request) {
  try {
    const courseId = new URL(request.url).searchParams.get("courseId");
    const course = await fetchCourse(courseId);
    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    const body = "Error fetching course";
    return new Response(JSON.stringify(body), { status: 500 });
  }
}
// HANDLING THE UPVOTE OF AN ANSWER
export async function postUpvote(request) {
  try {
    const data = await request.json();
    const existingVote = await checkExistingVote(data);
    const currentVoteCount = await getVoteCount(data.answer_id);
    if (existingVote.length > 0) {
      return new Response(
        JSON.stringify({
          message: "User has already upvoted this answer",
          votes: currentVoteCount,
        }),
        {
          status: 220,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    await insertUserVote(data);
    await incrementAnswerVotes(data.answer_id);
    await updateLastActivity(data.answer_id);
    const updatedVoteCount = await getVoteCount(data.answer_id);
    return new Response(
      JSON.stringify({
        message: "Upvote posted",
        votes: updatedVoteCount,
      }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error posting upvote:", error);
    return new Response("Error posting upvote", { status: 500 });
  }
}
// HANDLING THE POSTING OF AN ANSWER
export async function postUserAnswer(request) {
  try {
    const data = await request.json();
    const answer = await insertUserAnswer(data);
    await updateQuestionLastActivity(data.question_id);
    return new Response(
      JSON.stringify({
        message: "Answer posted successfully",
        answer: answer,
      }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error posting user answer:", error);
    return new Response("Error posting user answer", { status: 500 });
  }
}
// HANDLING THE UPVOTE OF A QUESTION
export async function postUpvoteQuestion(request) {
  try {
    const data = await request.json();
    const existingVote = await checkExistingQuestionVote(data);
    const currentVoteCount = await getQuestionVoteCount(data.question_id);
    if (existingVote.length > 0) {
      return new Response(
        JSON.stringify({
          message: "User has already upvoted this question",
          votes: currentVoteCount,
        }),
        {
          status: 220,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    await insertUserQuestionVote(data);
    await incrementQuestionVotes(data.question_id);
    await updateQuestionLastActivity(data.question_id);
    const updatedVoteCount = await getQuestionVoteCount(data.question_id);
    return new Response(
      JSON.stringify({
        message: "Upvote posted",
        votes: updatedVoteCount,
      }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error handling votes:", error);
    return new Response("Error handling votes", { status: 500 });
  }
}
// GETS QUESTIONS AND ANSWERS
export async function getQuestionsAndAnswers(request) {
  try {
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    const questionId = url.searchParams.get("questionId");
    const currentPage = Number(url.searchParams.get("page")) || 0;
    const answersPerPage = 20;
    const questionsPerPage = 20;

    let questions;
    if (questionId) {
      questions = await getSpecificQuestion(courseId, questionId);
    } else {
      questions = await getAllQuestions(
        courseId,
        questionsPerPage,
        currentPage
      );
    }
    for (let question of questions) {
      const answers = await getAnswersForQuestion(
        question.id,
        answersPerPage,
        currentPage
      );
      question.answers = answers;
    }

    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching questions and answers:", error);
    return new Response("Error fetching questions and answers", {
      status: 500,
    });
  }
}
