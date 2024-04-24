// Creating response
export function createResponse(data, errorMessage) {
  if (data) {
    return {
      status: 200,
      message: typeof data === "object" ? data : { message: data },
    };
  } else {
    return {
      status: 500,
      message: { message: errorMessage },
    };
  }
}
// Error handling
export function withErrorHandling(fn) {
  return async function (request) {
    try {
      return await fn(request);
    } catch (error) {
      console.error(error);
      return createResponse(null, "An error occurred");
    }
  };
}
