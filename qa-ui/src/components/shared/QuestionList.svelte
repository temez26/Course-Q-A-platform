<script>
  import Button from "./Button.svelte";
  export let qna = {};
  import { specificQuestionId } from "../../stores/stores.js";
  import { fetchAnswers, postUpvoteQuestion } from "../../api/apicalls.js";
</script>

<div class="mt-4 bg-gray-900 p-4 rounded-md shadow-lg">
  <div class="flex items-center justify-between">
    <h2 class="font-bold text-3xl mb-2 text-gray-100">
      Question:
      <a
        href={`/question`}
        class="font-bold text-2xl font-serif"
        on:click={() => {
          specificQuestionId.set(qna.id);
          fetchAnswers();
        }}
      >
        {qna.question}
      </a>
    </h2>
    <div class="flex items-center">
      <Button
        text="Upvote"
        action={async () => {
          await postUpvoteQuestion(qna.id);
        }}
      />
      <span class="ml-2 text-white">{qna.votes}</span>
    </div>
  </div>
</div>
