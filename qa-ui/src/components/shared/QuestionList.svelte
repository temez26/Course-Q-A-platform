<script>
  import Button from "./Button.svelte";
  export let qna = {};
  import { specificQuestionId } from "../../stores/stores.js";
  import { fetchAnswers, postUpvoteQuestion } from "../../api/apicalls.js";
</script>

<div class="mt-4 bg-gray-700 p-4 rounded-md overflow-y-auto">
  <div class="flex items-center justify-between">
    <h2 class="font-bold text-3xl mb-2 text-gray-100">
      Question:
      <a
        href={`/question`}
        class="font-bold text-2xl"
        on:click={() => {
          specificQuestionId.set(qna.id);
          fetchAnswers();
        }}
      >
        {qna.question}
      </a>
    </h2>
    <div class="flex items-center p-1">
      <span class="ml-2 text-white bg-green-500 p-1 m-2 rounded"
        >{qna.votes}</span
      >
      <Button
        text="Upvote"
        action={async () => {
          await postUpvoteQuestion(qna.id);
        }}
      />
    </div>
  </div>
</div>
