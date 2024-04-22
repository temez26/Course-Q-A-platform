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

// Filtering the answers to llm and human answers from function questionsAndAnswers
export async function processAnswers(jsonData) {
  jsonData.sort((a, b) => {
    const aLastActivity = new Date(
      a.answers[0]?.last_activity || a.last_activity
    );
    const bLastActivity = new Date(
      b.answers[0]?.last_activity || b.last_activity
    );
    return bLastActivity - aLastActivity;
  });

  let updatedQuestionsAndAnswers = await Promise.all(
    jsonData.map(async (qna) => {
      const llmAnswers = [];
      const humanAnswers = [];
      for (let answer of qna.answers) {
        if (answer.user_id === null) {
          llmAnswers.push(answer);
        } else {
          humanAnswers.push(answer);
        }
      }

      return { ...qna, llmAnswers, humanAnswers: humanAnswers.slice(0, 20) };
    })
  );

  return updatedQuestionsAndAnswers;
}
