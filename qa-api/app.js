import { serve } from "./deps.js";

const handleRequest = async (request) => {
  if (request.url.startsWith('/api/boi/')) {
    // Return "Hello World" for paths that start with /api/boi/
    return new Response("Hello World", {
      headers: { 'content-type': 'text/plain' },
    });
  }

  const data = await request.json();

  const response = await fetch("http://llm-api:7000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);