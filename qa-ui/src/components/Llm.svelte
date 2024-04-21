<script>
  import { onMount, onDestroy } from "svelte";
  import {
    userUuid,
    courseId,
    specificQuestionId,
    sortBy,
    filterOn,
    question,
    tempId,
    userAnswer,
    currentPage,
  } from "../stores/stores.js";

  let questionsAndAnswers = [];

  const askSomething = async () => {
    const tempQuestionId = $tempId++;
    const currentTime = new Date().getTime();

    questionsAndAnswers = [
      ...questionsAndAnswers,
      {
        id: tempQuestionId,
        question: $question,
        llmAnswers: [],
        humanAnswers: [],
        votes: 0,
        last_activity: currentTime,
      },
    ];

    const data = {
      user_id: $userUuid,
      question: $question,
      course_id: $courseId,
    };

    const response = await fetch("/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    $question = "";
    const index = questionsAndAnswers.findIndex(
      (qna) => qna.id === tempQuestionId
    );
    if (index !== -1) {
      questionsAndAnswers[index].id = responseData.questionId;
      questionsAndAnswers[index].llmAnswers = responseData.answers;
    }
    sortQuestions();
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

    questionsAndAnswers = jsonData.map((qna) => {
      const llmAnswers = qna.answers.filter(
        (answer) => answer.user_id === null
      );
      const humanAnswers = qna.answers.filter(
        (answer) => answer.user_id !== null
      );
      return {
        ...qna,
        llmAnswers,
        humanAnswers,
        votes: qna.votes,
        last_activity: new Date(qna.last_activity).getTime(),
      };
    });
    sortQuestions();
  };

  async function postUpvoteQuestion(questionId) {
    const response = await fetch("/api/postUpvoteQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: $userUuid, question_id: questionId }),
    });
    if (!response.ok) {
      console.error("Error posting upvote");
    } else {
      const index = questionsAndAnswers.findIndex(
        (qna) => qna.id === questionId
      );
      if (index !== -1) {
        questionsAndAnswers[index].last_activity = new Date().getTime();
      }
      await fetchQuestionsAndAnswers();
      sortQuestions();
    }
  }

  function handleQuestionClick(id) {
    specificQuestionId.set(id);
  }

  const sortQuestions = () => {
    if (!$filterOn) {
      return;
    }

    if ($sortBy === "mostUpvotes") {
      questionsAndAnswers = [...questionsAndAnswers].sort(
        (a, b) => b.votes - a.votes
      );
    } else if ($sortBy === "recentActivity") {
      questionsAndAnswers = [...questionsAndAnswers].sort(
        (a, b) => b.last_activity - a.last_activity
      );
    }
  };
  onMount(async () => {
    if (window.location.href.includes("course")) {
      currentPage.set(0);
      userAnswer.set("");
    }
    await fetchQuestionsAndAnswers();
    sortQuestions();
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
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      on:click={() => {
        sortBy.set("mostUpvotes");
        localStorage.setItem("sortBy", $sortBy);
        filterOn.set(true);
        localStorage.setItem("filterOn", $filterOn);
        sortQuestions();
      }}
    >
      Most Upvotes
    </button>
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      on:click={() => {
        sortBy.set("recentActivity");
        localStorage.setItem("sortBy", $sortBy);
        filterOn.set(true);
        localStorage.setItem("filterOn", $filterOn);
        sortQuestions();
      }}
    >
      Most recent activity
    </button>
    <p class="mt-2">{`Filtering by ${$sortBy}`}</p>

    {#each questionsAndAnswers as qna, i (i)}
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
