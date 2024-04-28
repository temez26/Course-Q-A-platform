<script>
  import { userAnswer, questionId } from "../../stores/stores.js";
  import { postUserAnswer } from "../../api/apicalls.js";
  import Button from "./Button.svelte";
  export let qna = {};
</script>

<div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
  <div class="text-2xl font-bold mb-4">
    <p class="flex items-center">
      <span class="mr-2 font-semibold text-gray-100">Question: </span>
      <span class="text-white overflow-auto break-words">{qna.question}</span>
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
    <Button
      text="Submit"
      action={() => {
        if ($userAnswer !== "") {
          userAnswer.set($userAnswer);
          questionId.set(qna.id);
          postUserAnswer();
          $userAnswer = "";
        }
      }}
      className="bg-blue-700 hover:bg-blue-900"
    />
  </div>
</div>
