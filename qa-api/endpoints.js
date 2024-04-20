import { sql } from "./database.js";

export async function getllm(request) {
  const data = await request.json();
  let result =
    await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.course_id}) RETURNING id`;
  const questionId = result[0].id;
  let allAnswers = [];

  for (let j = 0; j < 3; j++) {
    const response = await fetch("http://llm-api:7000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const jsonData = await response.json();
    const newAnswer = jsonData[0].generated_text;
    allAnswers.push(newAnswer);
    await sql`INSERT INTO Answers (answer, user_id, question_id) VALUES (${newAnswer}, ${null}, ${questionId})`;
  }
  return new Response(
    JSON.stringify({
      questionId: questionId,
      answers: allAnswers,
      message: "OK",
    }),
    {
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
    }
  );
}

export async function getCourses() {
  try {
    const courses = await sql`SELECT * FROM Courses;`;
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
export async function getCourse(request) {
  try {
    const courseId = new URL(request.url).searchParams.get("courseId");
    const course = await sql`SELECT * FROM Courses WHERE id = ${courseId};`;
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

export async function postUpvote(request) {
  try {
    const data = await request.json();
    const existingVote =
      await sql`SELECT * FROM UserVotes WHERE user_id = ${data.user_id} AND answer_id = ${data.answer_id}`;
    const currentVoteCount =
      await sql`SELECT votes FROM Answers WHERE id = ${data.answer_id}`;
    if (existingVote.length > 0) {
      return new Response(
        JSON.stringify({
          message: "User has already upvoted this answer",
          votes: currentVoteCount[0].votes,
        }),
        {
          status: 220,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    await sql`INSERT INTO UserVotes (user_id, answer_id) VALUES (${data.user_id}, ${data.answer_id})`;
    await sql`UPDATE Answers SET votes = votes + 1 WHERE id = ${data.answer_id}`;
    const updatedVoteCount =
      await sql`SELECT votes FROM Answers WHERE id = ${data.answer_id}`;
    return new Response(
      JSON.stringify({
        message: "Upvote posted",
        votes: updatedVoteCount[0].votes,
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
export async function postUserAnswer(request) {
  try {
    const data = await request.json();

    // Check if an answer from the user for the question already exists
    const existingAnswer =
      await sql`SELECT * FROM Answers WHERE user_id = ${data.user_id} AND question_id = ${data.question_id}`;

    if (existingAnswer.length > 0) {
      return new Response(
        JSON.stringify({
          message: "User has already posted an answer to this question",
        }),
        {
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }

    await sql`INSERT INTO Answers (answer, user_id, question_id) VALUES (${data.answer}, ${data.user_id}, ${data.question_id})`;

    return new Response(
      JSON.stringify({ message: "Answer posted successfully" }),
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
export async function getUpvotes(request) {
  try {
    // Get answer_id from the query parameters instead of the request body
    const url = new URL(request.url);
    const answer_id = url.searchParams.get("answer_id");

    const votes = await sql`SELECT votes FROM Answers WHERE id = ${answer_id}`;
    if (votes.length === 0) {
      return new Response(
        JSON.stringify({ message: "No answer found with this ID" }),
        {
          status: 404,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Vote count fetched",
        votes: votes[0].votes,
      }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return new Response("Error fetching vote count", { status: 500 });
  }
}
export async function getQuestionVotes(request) {
  try {
    // Get question_id from the query parameters instead of the request body
    const url = new URL(request.url);
    const question_id = url.searchParams.get("question_id");

    const votes =
      await sql`SELECT votes FROM Questions WHERE id = ${question_id}`;
    if (votes.length === 0) {
      return new Response(
        JSON.stringify({ message: "No question found with this ID" }),
        {
          status: 404,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Vote count fetched",
        votes: votes[0].votes,
      }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return new Response("Error fetching vote count", { status: 500 });
  }
}

export async function postUpvoteQuestion(request) {
  try {
    const data = await request.json();
    const existingVote =
      await sql`SELECT * FROM UserVotes WHERE user_id = ${data.user_id} AND question_id = ${data.question_id}`;
    const currentVoteCount =
      await sql`SELECT votes FROM Questions WHERE id = ${data.question_id}`;
    if (existingVote.length > 0) {
      return new Response(
        JSON.stringify({
          message: "User has already upvoted this question",
          votes: currentVoteCount[0].votes,
        }),
        {
          status: 220,
          headers: new Headers({ "content-type": "application/json" }),
        }
      );
    }
    await sql`INSERT INTO UserVotes (user_id, question_id) VALUES (${data.user_id}, ${data.question_id})`;
    await sql`UPDATE Questions SET votes = votes + 1 WHERE id = ${data.question_id}`;
    const updatedVoteCount =
      await sql`SELECT votes FROM Questions WHERE id = ${data.question_id}`;
    return new Response(
      JSON.stringify({
        message: "Upvote posted",
        votes: updatedVoteCount[0].votes,
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

export async function getQuestionsAndAnswers(request) {
  try {
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    const questionId = url.searchParams.get("questionId");

    let questions;
    if (questionId) {
      questions =
        await sql`SELECT * FROM Questions WHERE course_id = ${courseId} AND id = ${questionId};`;
    } else {
      questions =
        await sql`SELECT * FROM Questions WHERE course_id = ${courseId};`;
    }

    for (let question of questions) {
      const answers =
        await sql`SELECT * FROM Answers WHERE question_id = ${question.id};`;
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
