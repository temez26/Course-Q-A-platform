// endpoints.js

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

export async function getCourses(context) {
  console.log("getCourses called");
  // Fetch and return the list of courses
  return new Response("Courses fetched", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function postQuestion(context) {
  console.log("postQuestion called");
  // Handle question submission
  return new Response("Question posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function postAnswer(context) {
  console.log("postAnswer called");
  // Handle answer submission
  return new Response("Answer posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function postUpvote(context) {
  console.log("postUpvote called");
  // Handle upvotes
  return new Response("Upvote posted", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getQuestions(context) {
  console.log("getQuestions called");
  // Fetch and return the list of questions for a given course
  return new Response("Questions fetched", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getAnswers(context) {
  console.log("getAnswers called");
  // Fetch and return the list of answers for a given question
  return new Response("Answers fetched", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function generateAnswer(context) {
  console.log("generateAnswer called");
  // Generate an answer using a large language model
  return new Response("Answer generated", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}

export async function getboi(context) {
  console.log("getboi called");
  return new Response("Hello world", {
    headers: new Headers({ "content-type": "text/plain" }),
  });
}
