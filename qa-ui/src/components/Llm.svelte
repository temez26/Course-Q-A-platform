<script>
  import { onMount } from "svelte";
  import {
    specificQuestionId,
    question,
    userAnswer,
    coursepage,
    currentPage,
    questionsAndAnswers,
  } from "../stores/stores.js";
  import {
    askSomething,
    nextPage,
    prevPage,
    fetchQuestionsAndAnswers,
    postUpvoteQuestion,
  } from "../api/apicalls.js";

  function handleQuestionClick(id) {
    specificQuestionId.set(id);
  }
  onMount(async () => {
    if (window.location.href.includes("course")) {
      currentPage.set(0);
      userAnswer.set("");
    }
    await fetchQuestionsAndAnswers();
  });
</script>

<div
  class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 flex flex-col min-h-screen max-h-screen"
>
  <h1 class="text-4xl font-bold mb-4">Questions</h1>

  <input
    type="text"
    bind:value={$question}
    class="w-full px-3 py-2 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
    placeholder="Enter your question here"
  />

  <button
    class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    on:click={async () => {
      await askSomething();
    }}
  >
    Ask!
  </button>

  <div class="mt-2 mb-2 overflow-y-auto">
    <div class="bg-gray-800 p-4 rounded">
      <button
        class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-2"
        on:click={prevPage}
      >
        Previous
      </button>
      <span class="bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Page {$coursepage + 1}
      </span>
      <button
        class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ml-2"
        on:click={nextPage}
      >
        Next
      </button>
    </div>

    {#each $questionsAndAnswers as qna, i (i)}
      <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-3xl mb-2">
            Question:
            <a
              href={`/question`}
              class="font-bold text-2xl font-serif"
              on:click={() => handleQuestionClick(qna.id)}
            >
              {qna.question}
            </a>
          </h2>
          <div class="flex items-center">
            <button
              class="ml-4 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              on:click={async () => {
                await postUpvoteQuestion(qna.id);
              }}
            >
              Upvote
            </button>
            <span class="ml-2 text-white">{qna.votes}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
