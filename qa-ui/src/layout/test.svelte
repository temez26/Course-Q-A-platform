<script>
  let message = "";

  async function callApi(path, method = "GET") {
    const response = await fetch(path, { method });
    if (response.ok) {
      message = await response.text();
    } else {
      message = "Error: " + response.status;
    }
  }
</script>

<main>
  <h1>{message}</h1>

  <button on:click={() => callApi("/api/boi")}>Get Boi</button>
  <button on:click={() => callApi("/api/getCourses")}>Get Courses</button>
  <button on:click={() => callApi("/api/postQuestion", "POST")}
    >Post Question</button
  >
  <button on:click={() => callApi("/api/postAnswer", "POST")}
    >Post Answer</button
  >
  <button on:click={() => callApi("/api/postUpvote", "POST")}
    >Post Upvote</button
  >
  <button on:click={() => callApi("/api/getQuestions")}>Get Questions</button>
  <button on:click={() => callApi("/api/getAnswers")}>Get Answers</button>
  <button on:click={() => callApi("/api/generateAnswer", "POST")}
    >Generate Answer</button
  >
</main>
