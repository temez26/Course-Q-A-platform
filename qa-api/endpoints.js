import { sql } from "./database.js";

export async function getllm(request) {
  const data = await request.json();

  const response = await fetch("http://llm-api:7000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
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

export async function postQuestion(request) {
  try {
    const data = await request.json();
    const result =
      await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.course_id}) RETURNING id`;
    const questionId = result[0].id;
    console.log(questionId);
    return new Response(
      JSON.stringify({ message: "Question posted", questionId }),
      {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (error) {
    console.error("Error posting question:", error);
    return new Response(JSON.stringify({ error: "Error posting question" }), {
      status: 500,
    });
  }
}
export async function postAnswer(request) {
  try {
    const data = await request.json();
    await sql`INSERT INTO Answers (answer, user_id, question_id) VALUES (${data.answer}, ${data.user_id}, ${data.question_id})`;
    return new Response(JSON.stringify({ message: "Answer posted" }), {
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    return new Response(JSON.stringify({ error: "Error posting answer" }), {
      status: 500,
    });
  }
}
export async function postUpvote(request) {
  try {
    const data = await request.json();
    await sql`INSERT INTO Upvotes (user_id, answer_id) VALUES (${data.user}, ${data.answer})`;
    return new Response("Upvote posted", {
      headers: new Headers({ "content-type": "text/plain" }),
    });
  } catch (error) {
    console.error("Error posting upvote:", error);
    return new Response("Error posting upvote", { status: 500 });
  }
}

export async function getQuestionsAndAnswers(request) {
  try {
    const courseId = new URL(request.url).searchParams.get("courseId");
    const questions =
      await sql`SELECT * FROM Questions WHERE course_id = ${courseId};`;

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
