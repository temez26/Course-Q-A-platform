<script>
  import { userUuid, currentCourse, courseId } from "../stores/stores.js";

  let question = "";
  let answers = [];
  let questionsAndAnswers = [];

  const askSomething = async () => {
    const data = {
      user_id: $userUuid,
      question: question,
      course_id: $courseId,
    };
    const response = await fetch("/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const jsonData = await response.json();
    console.log(jsonData);
    const newAnswers = jsonData.answers;
    answers = newAnswers;
    return newAnswers;
  };

  const fetchQuestionsAndAnswers = async () => {
    const response = await fetch(
      `/api/getQuestionsAndAnswers?courseId=${$courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const jsonData = await response.json();
    questionsAndAnswers = jsonData;
  };
  fetchQuestionsAndAnswers();
</script>

<div class="bg-gray-100 p-6 mt-2">
  <input
    type="text"
    bind:value={question}
    class="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
    placeholder="Enter your question here"
  />

  <button
    class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    on:click={async () => {
      await askSomething();

      question = "";
    }}
  >
    Ask!
  </button>

  {#each answers as answer, i (i)}
    <div class="mt-4 bg-white p-4 rounded-md">
      <h2 class="font-bold text-lg">LLM Answer {i + 1}:</h2>
      <p>{answer}</p>
    </div>
  {/each}
</div>
<div class="bg-gray-100 p-6 mt-2">
  {#each questionsAndAnswers as qna, i (i)}
    <div class="mt-4 bg-white p-4 rounded-md">
      <h2 class="font-bold text-lg">Question {i + 1}:</h2>
      <p>{qna.question}</p>
      <h3 class="font-bold text-lg">Answers:</h3>
      <ul>
        {#each qna.answers as answer, j (j)}
          <li>{answer.answer}</li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
