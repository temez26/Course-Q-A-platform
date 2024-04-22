import { sql } from "./database.js";

export async function getllm(request) {
  const data = await request.json();
  let result =
    await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.course_id}) RETURNING id`;
  const questionId = result[0].id;

  // Schedule handleLLMApi to run after this function has returned
  queueMicrotask(() => handleLLMApi(data, questionId));

  // Return the response to the frontend
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

  // Create an array of promises for the fetch requests
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

  // Wait for all the fetch requests to complete
  const responses = await Promise.all(fetchPromises);

  // Process the responses
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
    await sql`UPDATE Answers SET last_activity = NOW() WHERE id = ${data.answer_id}`;
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

    // Insert the new answer into the database
    const result = await sql`
      INSERT INTO Answers (answer, user_id, question_id, last_activity) 
      VALUES (${data.answer}, ${data.user_id}, ${data.question_id}, NOW())
      RETURNING *;
    `;

    // Update the last_activity field of the question
    await sql`
      UPDATE Questions
      SET last_activity = NOW()
      WHERE id = ${data.question_id};
    `;

    return new Response(
      JSON.stringify({
        message: "Answer posted successfully",
        answer: result[0],
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
    await sql`UPDATE Questions SET last_activity = NOW() WHERE id = ${data.question_id}`;
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
    const currentPage = Number(url.searchParams.get("page")) || 0;
    const answersPerPage = 20;
    const questionsPerPage = 20;

    let questions;
    if (questionId) {
      questions = await sql`
        SELECT * FROM Questions WHERE course_id = ${courseId} AND id = ${questionId}
        ORDER BY last_activity DESC;
        `;
    } else {
      questions = await sql`
        SELECT * FROM Questions WHERE course_id = ${courseId} ORDER BY last_activity DESC LIMIT ${questionsPerPage} OFFSET ${
        currentPage * questionsPerPage
      };
        `;
    }
    for (let question of questions) {
      const answers = await sql`
        (SELECT * FROM Answers WHERE question_id = ${
          question.id
        } AND user_id IS NULL)
        UNION
        (SELECT * FROM Answers WHERE question_id = ${
          question.id
        } AND user_id IS NOT NULL ORDER BY last_activity DESC LIMIT ${answersPerPage} OFFSET ${
        currentPage * answersPerPage
      })
        ORDER BY last_activity DESC;
      `;
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
