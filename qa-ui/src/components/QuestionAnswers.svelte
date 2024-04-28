<script>
  import { onMount } from "svelte";
  import Button from "./shared/Button.svelte";
  import AnswerList from "./shared/AnswerList.svelte";
  import Pagination from "./shared/Pagination.svelte";
  import AnswerInput from "./shared/AnswerInput.svelte";
  import LlmList from "./shared/LlmList.svelte";

  import { question, updatedAnswers, answerpage } from "../stores/stores.js";
  import { fetchAnswers, postUpvoteAnswer } from "../api/apicalls.js";

  const nextPage = () => {
    if ($updatedAnswers[0].humanAnswers.length < 20) {
      return;
    }
    $answerpage += 1;
    fetchAnswers();
  };

  const prevPage = () => {
    if ($answerpage > 0) {
      $answerpage -= 1;
      fetchAnswers();
    }
  };
  let intervalId;
  onMount(async () => {
    if (window.location.href.includes("question")) {
      question.set("");
    }

    fetchAnswers();

    intervalId = setInterval(async () => {
      const count = $updatedAnswers[0].llmAnswers.length;
      if (count < 3) {
        fetchAnswers();
      } else {
        clearInterval(intervalId);
      }
    }, 2200);
  });
</script>

<div class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 rounded">
  <a href="course/">
    <Button
      text="Back to the Course"
      className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
    />
  </a>

  {#each $updatedAnswers as qna, i (i)}
    <AnswerInput {qna} />
    <div class="bg-gray-800 p-4 rounded">
      <h3 class="font-bold text-xl mb-2 text-gray-100">LLM Answers:</h3>
      {#if !Array.isArray(qna.llmAnswers) || qna.llmAnswers.length === 0}
        <p>Loading...</p>
      {:else}
        <div class="overflow-y-auto max-h-96">
          <LlmList answers={qna.llmAnswers} {postUpvoteAnswer} />
        </div>
      {/if}
    </div>

    <Pagination {nextPage} {prevPage} page={$answerpage} />
    <div class="bg-gray-800 p-4 rounded">
      <h3 class="font-bold text-xl mb-2 text-gray-100">Human Answers:</h3>

      <div class="overflow-y-auto max-h-96">
        <AnswerList answers={qna.humanAnswers} {postUpvoteAnswer} />
      </div>
    </div>
  {/each}
</div>
