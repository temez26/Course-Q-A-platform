<script>
  import { onMount } from "svelte";
  import Pagination from "./Pagination.svelte";
  import {
    question,
    userAnswer,
    questionpage,
    questionsAndAnswers,
    course,
    specificQuestionId,
    answerpage,
  } from "../stores/stores.js";
  import {
    askSomething,
    fetchQuestions,
    postUpvoteQuestion,
    fetchCourse,
    fetchAnswers,
  } from "../api/apicalls.js";

  const nextPage = () => {
    $questionpage += 1;
    fetchQuestions();
  };

  const prevPage = () => {
    if ($questionpage > 0) {
      $questionpage -= 1;
    }
    fetchQuestions();
  };

  onMount(async () => {
    if (window.location.href.includes("course")) {
      answerpage.set(0);
      userAnswer.set("");
    }
    fetchCourse();
    await fetchQuestions();
  });
</script>

<div class="bg-gray-800 rounded bg-opacity-75 text-white p-6">
  <h1 class="text-5xl font-bold mb-4">Welcome to the course page</h1>
  {#if $course}
    <div class="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold text-gray-200 mb-2">{$course.name}</h2>
      <p class="text-lg text-gray-300">{$course.description}</p>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
  <a href="/courses">
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      Back to Courses
    </button>
  </a>
</div>

<div
  class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 flex flex-col min-h-screen max-h-screen"
>
  <h1 class="text-4xl font-bold mb-4 text-gray-100">Questions</h1>

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

  <Pagination {nextPage} {prevPage} page={$questionpage} />

  {#each $questionsAndAnswers as qna, i (i)}
    <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-3xl mb-2 text-gray-100">
          Question:
          <a
            href={`/question`}
            class="font-bold text-2xl font-serif"
            on:click={() => {
              specificQuestionId.set(qna.id);
              fetchAnswers();
            }}
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
