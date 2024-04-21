<script>
  import { onMount } from "svelte";

  import {
    userUuid,
    courseId,
    specificQuestionId,
    currentPage,
    userAnswer,
    question,
  } from "../stores/stores.js";

  let questionsAndAnswers = [];

  const nextPage = () => {
    currentPage.update((n) => n + 1);
    fetchQuestionsAndAnswers();
  };

  const prevPage = () => {
    currentPage.update((n) => (n > 0 ? n - 1 : n));
    fetchQuestionsAndAnswers();
  };
  async function fetchQuestionsAndAnswers() {
    const response = await fetch(
      `/api/getQuestionsAndAnswers?courseId=${$courseId}&questionId=${$specificQuestionId}&page=${$currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let jsonData = await response.json();
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
          console.log("User ID:", answer.user_id);
          if (answer.user_id === null) {
            llmAnswers.push(answer);
          } else {
            humanAnswers.push(answer);
          }
        }
        console.log("LLM Answers:", llmAnswers);
        console.log("Human Answers:", humanAnswers);
        return { ...qna, llmAnswers, humanAnswers: humanAnswers.slice(0, 20) };
      })
    );

    questionsAndAnswers = updatedQuestionsAndAnswers;
  }

  async function postUpvoteAnswer(answerId) {
    const response = await fetch("/api/postUpvote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: $userUuid, answer_id: answerId }),
    });
    const jsonData = await response.json();
    console.log(jsonData.votes);
    if (!response.ok) {
      console.error("Error posting upvote");
    } else {
      for (let qna of questionsAndAnswers) {
        for (let answer of qna.answers) {
          if (answer.id === answerId) {
            answer.last_activity = new Date();
          }
        }
      }
      await fetchQuestionsAndAnswers();
    }
  }
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
      await fetchQuestionsAndAnswers();
    }
  }
  async function postUserAnswer(answer, questionId) {
    const data = {
      user_id: $userUuid,
      answer: answer,
      question_id: questionId,
    };
    const response = await fetch("/api/postUserAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Error posting user answer");
    } else {
      for (let qna of questionsAndAnswers) {
        if (qna.id === questionId) {
          qna.last_activity = new Date();

          qna.answers.sort((a, b) => {
            const aLastActivity = new Date(a.last_activity);
            const bLastActivity = new Date(b.last_activity);
            return bLastActivity - aLastActivity;
          });
        }
      }
      fetchQuestionsAndAnswers();
    }
  }

  onMount(async () => {
    fetchQuestionsAndAnswers();
  });
</script>

<div
  class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 flex flex-col min-h-screen max-h-screen"
>
  <h1 class="text-4xl font-bold mb-2">Question</h1>
  <a href="course/"
    ><button
      class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
      >Back to Course</button
    ></a
  >

  {#each questionsAndAnswers as qna, i (i)}
    <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
      <h1 class="text-2xl font-bold mb-4">{qna.question}</h1>
      <div class="flex items-center mb-2">
        <div class="bg-blue-500 text-white p-2 rounded-full mr-2">
          <p class="font-bold">{qna.votes}</p>
        </div>
        <button
          class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          on:click={() => postUpvoteQuestion(qna.id)}>Upvote</button
        >
      </div>
      <div class="bg-gray-800 p-4 rounded mt-4">
        <h3 class="font-bold text-xl mb-2">Post Your Answer:</h3>
        <input
          type="text"
          bind:value={$userAnswer}
          class="bg-gray-700 text-white p-2 rounded w-full mb-2"
          placeholder="Type your answer here..."
        />
        <button
          class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          on:click={() => {
            postUserAnswer($userAnswer, qna.id);
            $userAnswer = "";
          }}>Submit</button
        >
      </div>
      <div class="bg-gray-800 p-4 rounded">
        <h3 class="font-bold text-xl mb-2">LLM Answers:</h3>
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
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <button
          class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-2"
          on:click={prevPage}
        >
          Previous
        </button>
        <span class="bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Page {$currentPage + 1}
        </span>
        <button
          class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ml-2"
          on:click={nextPage}
        >
          Next
        </button>
      </div>
      <div class="bg-gray-800 p-4 rounded overflow-y-auto">
        <h3 class="font-bold text-xl mb-2">Human Answers:</h3>
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
