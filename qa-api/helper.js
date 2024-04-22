// Creating response
export async function createResponse(data, errorMessage) {
  if (data) {
    const payload = typeof data === "object" ? JSON.stringify(data) : data;
    return new Response(payload, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } else {
    return new Response(errorMessage, { status: 500 });
  }
}
// Error handling
export function withErrorHandling(fn) {
  return async function (request) {
    try {
      return await fn(request);
    } catch (error) {
      return createResponse(null, "An error occurred");
    }
  };
}

// Parse json data
export async function parseJson(request) {
  const data = await request.json();
  return data;
}
