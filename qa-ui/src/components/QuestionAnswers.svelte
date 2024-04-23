<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  import {
    answerpage,
    userAnswer,
    question,
    updatedAnswers,
    questionId,
  } from "../stores/stores.js";
  import {
    fetchAnswers,
    postUpvoteAnswer,
    postUserAnswer,
  } from "../api/apicalls.js";

  export const nextPage1 = () => {
    $answerpage += 1;
    fetchAnswers();
  };

  export const prevPage1 = () => {
    if ($answerpage > 0) {
      $answerpage -= 1;
    }
    fetchAnswers();
  };

  onMount(async () => {
    if (window.location.href.includes("question")) {
      question.set("");
    }
    await fetchAnswers();

    setTimeout(async () => {
      const qna = get(updatedAnswers);
      if (qna.length === 0 || qna[0].answers.length === 0) {
        await fetchAnswers();
      }
    }, 2200);
  });
</script>

<div
  class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 flex flex-col rounded"
>
  <a href="course/"
    ><button
      class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
      >Back to Course</button
    ></a
  >

  {#each $updatedAnswers as qna, i (i)}
    <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
      <div class="text-2xl font-bold mb-4">
        <p class="flex items-center">
          <span class="mr-2 font-semibold text-gray-100">Question: </span>
          <span class="text-white">{qna.question}</span>
        </p>
        <p class="text-gray-200">
          Votes: <span class="text-white">{qna.votes}</span>
        </p>
      </div>

      <div class="bg-gray-800 p-4 rounded mt-4">
        <h3 class="font-bold text-xl mb-2 text-gray-100">Post Your Answer:</h3>
        <input
          type="text"
          bind:value={$userAnswer}
          class="bg-gray-700 text-white p-2 rounded w-full mb-2"
          placeholder="Type your answer here..."
        />
        <button
          class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          on:click={() => {
            questionId.set(qna.id);
            postUserAnswer();

            $userAnswer = "";
          }}>Submit</button
        >
      </div>
      <div class="bg-gray-800 p-4 rounded">
        <h3 class="font-bold text-xl mb-2 text-gray-100">LLM Answers:</h3>
        {#if qna.llmAnswers.length === 0}
          <p>Loading...</p>
        {:else}
          <ul>
            {#each qna.llmAnswers as answer, j (j)}
              <li class="mb-2">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="bg-green-500 text-white p-2 rounded mr-2">
                      <p class="font-bold">{answer.votes}</p>
                    </div>
                    <p class="text-lg">{answer.answer}</p>
                  </div>
                  <button
                    class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                    on:click={() => postUpvoteAnswer(answer.id)}>Upvote</button
                  >
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <button
          class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-2"
          on:click={prevPage1}
        >
          Previous
        </button>
        <span class="bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Page {$answerpage + 1}
        </span>
        <button
          class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ml-2"
          on:click={nextPage1}
        >
          Next
        </button>
      </div>
      <div class="bg-gray-800 p-4 rounded overflow-y-auto">
        <h3 class="font-bold text-xl mb-2 text-gray-100">Human Answers:</h3>
        <div class="overflow-y-auto max-h-96">
          <ul>
            {#each qna.humanAnswers as answer, j (j)}
              <li class="mb-2">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="bg-green-500 text-white p-2 rounded mr-2">
                      <p class="font-bold">{answer.votes}</p>
                    </div>
                    <p class="text-lg">{answer.answer}</p>
                  </div>
                  <button
                    class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                    on:click={() => postUpvoteAnswer(answer.id)}
                  >
                    Upvote
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/each}
</div>
