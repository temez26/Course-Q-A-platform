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
    console.log(data);
    await sql`INSERT INTO Questions (question, user_id, course_id) VALUES (${data.question}, ${data.user_id}, ${data.course_id})`;
    return new Response("Question posted", {
      headers: new Headers({ "content-type": "text/plain" }),
    });
  } catch (error) {
    console.error("Error posting question:", error);
    return new Response("Error posting question", { status: 500 });
  }
}

export async function postAnswer(request) {
  try {
    const data = await request.json();
    await sql`INSERT INTO Answers (answer_text, user_id, question_id) VALUES (${data.answer}, ${data.user}, ${data.question})`;
    return new Response("Answer posted", {
      headers: new Headers({ "content-type": "text/plain" }),
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    return new Response("Error posting answer", { status: 500 });
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

export async function getQuestions(request) {
  try {
    const courseId = new URL(request.url).searchParams.get("courseId");
    const questions =
      await sql`SELECT * FROM Questions WHERE course_id = ${courseId};`;
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response("Error fetching questions", { status: 500 });
  }
}

export async function getAnswers(request) {
  try {
    const questionId = new URL(request.url).searchParams.get("questionId");
    const answers =
      await sql`SELECT * FROM Answers WHERE question_id = ${questionId};`;
    return new Response(JSON.stringify(answers), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return new Response("Error fetching answers", { status: 500 });
  }
}
