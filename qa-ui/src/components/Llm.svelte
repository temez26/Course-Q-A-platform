<script>
  import { onMount } from "svelte";
  import { userUuid, courseId, specificQuestionId } from "../stores/stores.js";

  let question = "";
  let questionsAndAnswers = [];
  let tempId = 0;
  let sortBy = localStorage.getItem("sortBy") || "newest";
  let filterOn = localStorage.getItem("filterOn") === "true" ? true : false;

  const askSomething = async () => {
    const tempQuestionId = tempId++;
    question = "";
    questionsAndAnswers = [
      ...questionsAndAnswers,
      {
        id: tempQuestionId,
        question: question,
        llmAnswers: [],
        humanAnswers: [],
        votes: 0,
      },
    ];

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

    const responseData = await response.json();

    const index = questionsAndAnswers.findIndex(
      (qna) => qna.id === tempQuestionId
    );
    if (index !== -1) {
      questionsAndAnswers[index].id = responseData.questionId;
      questionsAndAnswers[index].votes = await getQuestionVotes(
        responseData.questionId
      );
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
    let updatedQuestionsAndAnswers = jsonData.map(async (qna) => {
      const llmAnswers = [];
      const humanAnswers = [];
      for (let answer of qna.answers) {
        if (answer.user_id === null) {
          llmAnswers.push(answer);
        } else {
          humanAnswers.push(answer);
        }
      }
      const votes = await getQuestionVotes(qna.id);
      return {
        ...qna,
        llmAnswers,
        humanAnswers,
        votes,
        last_activity: qna.last_activity,
      };
    });

    questionsAndAnswers = await Promise.all(updatedQuestionsAndAnswers);
    console.log(questionsAndAnswers);
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
      await fetchQuestionsAndAnswers();
      sortQuestions();
    }
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

  const sortQuestions = () => {
    if (!filterOn) {
      return;
    }

    if (sortBy === "mostUpvotes") {
      questionsAndAnswers = [...questionsAndAnswers].sort(
        (a, b) => b.votes - a.votes
      );
    } else if (sortBy === "newest") {
      questionsAndAnswers = [...questionsAndAnswers].sort(
        (a, b) => b.id - a.id
      );
    }
  };

  onMount(async () => {
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
    bind:value={question}
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
        sortBy = "mostUpvotes";
        localStorage.setItem("sortBy", sortBy);
        filterOn = true;
        localStorage.setItem("filterOn", filterOn);
        sortQuestions();
      }}
    >
      Most Upvotes
    </button>
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      on:click={() => {
        sortBy = "newest";
        localStorage.setItem("sortBy", sortBy);
        filterOn = true;
        localStorage.setItem("filterOn", filterOn);
        sortQuestions();
      }}
    >
      Newest
    </button>
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      on:click={() => {
        sortBy = "recentActivity";
        localStorage.setItem("sortBy", sortBy);
        filterOn = false;
        localStorage.setItem("filterOn", filterOn);
        fetchQuestionsAndAnswers();
      }}
    >
      Most recent activity
    </button>
    <p class="mt-2">{`Filtering by ${sortBy}`}</p>

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
