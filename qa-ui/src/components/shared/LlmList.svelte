<script>
  import Button from "./Button.svelte";
  export let answers = [];
  import { answerId } from "../../stores/stores.js";
  import { postUpvoteAnswer } from "../../api/apicalls.js";
</script>

<ul>
  {#each answers as answer, j (j)}
    <li class="mb-2 bg-gray-700 rounded p-2">
      <div class="flex justify-between items-center">
        <p class="text-lg overflow-auto break-words flex-grow">
          {answer.llm_answer}
        </p>
        <div class="flex items-center">
          <div class="bg-green-600 text-gray-200 p-1 rounded m-2">
            <p class="font-bold">{answer.votes}</p>
          </div>
          <Button
            text="Upvote"
            action={() => {
              answerId.set(answer.id);
              postUpvoteAnswer();
            }}
          />
        </div>
      </div>
    </li>
  {/each}
</ul>
