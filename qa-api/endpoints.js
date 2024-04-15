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

export async function postQuestion() {
  // Handle question submission
  return new Response("Question posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function postAnswer() {
  // Handle answer submission
  return new Response("Answer posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function postUpvote() {
  // Handle upvotes
  return new Response("Upvote posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getQuestions() {
  // Fetch and return the list of questions for a given course
  return new Response("Questions fetched", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getAnswers() {
  // Fetch and return the list of answers for a given question
  return new Response("Answers fetched", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function generateAnswer() {
  // Generate an answer using a large language model
  return new Response("Answer generated", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getboi() {
  return new Response("Hello world", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}
