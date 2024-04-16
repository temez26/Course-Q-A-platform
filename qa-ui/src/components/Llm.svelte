<script>
  import { userUuid, currentCourse, courseId } from "../stores/stores.js";

  let question = "";
  let answers = []; // variable to store the answers

  const askSomething = async () => {
    let newAnswers = []; // create a new array to store the answers
    for (let i = 0; i < 3; i++) {
      // make 3 requests
      const data = {
        user: $userUuid,
        question: question,
        course: $currentCourse,
      };
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const jsonData = await response.json();
      console.log(jsonData);
      newAnswers.push(jsonData[0].generated_text);
    }
    answers = newAnswers;
  };
  const handleQuestionandAnswer = async () => {
    let newAnswers = []; // create a new array to store the answers
    console.log($courseId, question, $userUuid);
    // Post the question
    const questionData = {
      user_id: $userUuid,
      question: question,
      course_id: $courseId,
    };
    const questionResponse = await fetch("/api/postQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    const questionJsonData = await questionResponse.json();
    console.log(questionJsonData);

    // Post the answers
    for (let i = 0; i < 3; i++) {
      const answerData = {
        user: $userUuid,
        answer: answers + (i + 1),
        question: question,
      };
      const answerResponse = await fetch("/api/postAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answerData),
      });

      const answerJsonData = await answerResponse.json();
      console.log(answerJsonData);
      newAnswers.push(answerJsonData[0].generated_text);
    }
    answers = newAnswers;
  };
  const getAnswers = async () => {
    const answersResponse = await fetch(
      `/api/getAnswers?questionId=${questionJsonData.id}`
    );
    const answersJsonData = await answersResponse.json();
    console.log(answersJsonData);
    let newAnswers = answersJsonData.map((answer) => answer.answer_text);

    answers = newAnswers;
  };
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
    on:click={(askSomething, handleQuestionandAnswer)}
  >
    Ask!
  </button>

  <!-- Output section -->
  {#each answers as answer, i (i)}
    <div class="mt-4 bg-white p-4 rounded-md">
      <h2 class="font-bold text-lg">LLM Answer {i + 1}:</h2>
      <p>{answer}</p>
    </div>
  {/each}
</div>
