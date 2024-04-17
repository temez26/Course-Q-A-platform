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
      <p>Upvotes: {answer.votes}</p>
      <button on:click={() => postUpvoteAnswer(answer.id)}>Upvote</button>
    </div>
  {/each}
</div>

<div class="bg-gray-100 p-6 mt-2">
  {#each questionsAndAnswers as qna, i (i)}
    <div class="mt-4 bg-white p-4 rounded-md">
      <h2 class="font-bold text-lg">Question {i + 1}:</h2>
      <p>{qna.question}</p>
      <p>Upvotes: {qna.votes}</p>
      <button on:click={() => postUpvoteQuestion(qna.id)}>Upvote</button>
      <h3 class="font-bold text-lg">Answers:</h3>
      <ul>
        {#each qna.answers as answer, j (j)}
          <li>
            {answer.answer} (Upvotes: {answer.votes})
            <button on:click={() => postUpvoteAnswer(answer.id)}>Upvote</button>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
