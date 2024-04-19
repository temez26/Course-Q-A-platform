<script>
  import { onMount } from "svelte";
  import { userUuid, courseId, specificQuestionId } from "../stores/stores.js";

  let question = "";
  let userAnswer = "";
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
    const newAnswers = jsonData.answers;
    answers = newAnswers;
    fetchQuestionsAndAnswers();
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
    let updatedQuestionsAndAnswers = jsonData.map((qna) => {
      const llmAnswers = [];
      const humanAnswers = [];
      for (let answer of qna.answers) {
        if (answer.user_id === null) {
          llmAnswers.push(answer);
        } else {
          humanAnswers.push(answer);
        }
      }
      return { ...qna, llmAnswers, humanAnswers };
    });

    questionsAndAnswers = updatedQuestionsAndAnswers;
  };

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
      fetchQuestionsAndAnswers();
    }
  }

  async function getAnswerVotes(answerId) {
    const response = await fetch(`/api/getUpvotes?answer_id=${answerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonData = await response.json();
    return jsonData.votes;
  }
  async function getQuestionVotes(questionId) {
    const response = await fetch(
      `/api/getQuestionVotes?question_id=${questionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const jsonData = await response.json();
    return jsonData.votes;
  }
  function handleQuestionClick(id) {
    specificQuestionId.set(id);
  }

  onMount(async () => {
    fetchQuestionsAndAnswers();
  });
</script>

<div
  class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2 flex flex-col min-h-screen max-h-screen"
>
  <h1 class="text-4xl font-bold mb-4">Questions</h1>

  <input
    type="text"
    bind:value={question}
    class="w-full px-3 py-2 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
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

  <div class="mt-2 mb-2">
    {#each questionsAndAnswers as qna, i (i)}
      <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
        <h2 class="font-bold text-2xl mb-2">
          Question {i + 1}:
          <a
            href={`/question`}
            class="font-bold text-2xl font-serif"
            on:click={() => handleQuestionClick(qna.id)}
          >
            {qna.question}
          </a>
        </h2>
      </div>
    {/each}
  </div>
</div>
