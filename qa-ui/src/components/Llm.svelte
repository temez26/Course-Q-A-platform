<script>
  import { onMount } from "svelte";
  import { userUuid, courseId } from "../stores/stores.js";

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
    questionsAndAnswers = jsonData;
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
    const updatedVotes = jsonData.votes;
    console.log(jsonData.votes);
    if (!response.ok) {
      console.error("Error posting upvote");
    } else {
      questionsAndAnswers = questionsAndAnswers.map((qna) => {
        return {
          ...qna,
          answers: qna.answers.map((answer) => {
            if (answer.id === answerId) {
              return { ...answer, votes: updatedVotes };
            } else {
              return answer;
            }
          }),
        };
      });
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
    const jsonData = await response.json();
    const updatedVotes = jsonData.votes;
    if (!response.ok) {
      console.error("Error posting upvote");
    } else {
      questionsAndAnswers = questionsAndAnswers.map((qna) => {
        if (qna.id === questionId) {
          return { ...qna, votes: updatedVotes };
        } else {
          return qna;
        }
      });
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

  onMount(async () => {
    for (let answer of answers) {
      answer.votes = await getAnswerVotes(answer.id);
      qna.votes = await getQuestionVotes(qna.id);
    }
    for (let qna of questionsAndAnswers) {
      for (let answer of qna.answers) {
        answer.votes = await getAnswerVotes(answer.id);
        qna.votes = await getQuestionVotes(qna.id);
      }
    }
    fetchQuestionsAndAnswers();
  });
</script>

<div class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2">
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

  {#each answers as answer, i (i)}
    <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
      <h2 class="font-bold text-2xl text-blue-300">LLM Answer {i + 1}:</h2>
      <p class="text-lg">{answer}</p>
    </div>
  {/each}
</div>

<div class="bg-gray-800 bg-opacity-75 text-white p-6 mt-2">
  {#each questionsAndAnswers as qna, i (i)}
    <div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
      <h2 class="font-bold text-2xl mb-2">Question {i + 1}:</h2>
      <p class="text-4xl text-blue-200 mb-2">{qna.question}</p>
      <div class="flex items-center mb-2">
        <div class="bg-blue-500 text-white p-2 rounded-full mr-2">
          <p class="font-bold">{qna.votes}</p>
        </div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={() => postUpvoteQuestion(qna.id)}>Upvote</button
        >
      </div>
      <h3 class="font-bold text-xl mb-2">Answers:</h3>
      <ul>
        {#each qna.answers as answer, j (j)}
          <li class="mb-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="bg-green-500 text-white p-2 rounded-full mr-2">
                  <p class="font-bold">{answer.votes}</p>
                </div>
                <p class="text-lg">{answer.answer}</p>
              </div>
              <button
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                on:click={() => postUpvoteAnswer(answer.id)}>Upvote</button
              >
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
