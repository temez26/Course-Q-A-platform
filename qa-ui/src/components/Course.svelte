<script>
  import { onMount } from "svelte";
  import Pagination from "./shared/Pagination.svelte";
  import QuestionList from "./shared/QuestionList.svelte";
  import Button from "./shared/Button.svelte";
  import QuestionInput from "./shared/QuestionInput.svelte";
  import {
    userAnswer,
    questionsAndAnswers,
    course,
    page,
    answerpage,
  } from "../stores/stores.js";
  import { fetchQuestions, fetchCourse } from "../api/apicalls.js";

  const nextPage = () => {
    if ($questionsAndAnswers.length < 20) {
      return;
    }
    $page += 1;
    fetchQuestions();
  };

  const prevPage = () => {
    if ($page > 0) {
      $page -= 1;
      fetchQuestions();
    }
  };

  onMount(async () => {
    if (window.location.href.includes("course")) {
      userAnswer.set("");
      answerpage.set(0);
    }

    fetchCourse();
    fetchQuestions();
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
    <Button
      text="Back to Courses"
      className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 mt-2 rounded"
    />
  </a>
</div>

<div class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 rounded">
  <div class="flex flex-col w-full sm:w-2/3 mx-auto">
    <QuestionInput />
  </div>
  <Pagination {nextPage} {prevPage} page={$page} />

  {#each $questionsAndAnswers as qna, i (i)}
    <div class="overflow-y-auto"><QuestionList {qna} /></div>
  {/each}
</div>
