<script>
  import Button from "./Button.svelte";
  export let answers = [];
  import { postUpvoteAnswer } from "../../api/apicalls.js";
</script>

<ul>
  {#each answers as answer, j (j)}
    <li class="mb-2 bg-gray-700 rounded p-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <p class="text-lg">{answer.answer}</p>
        </div>
        <div class="flex items-center">
          <div class="bg-green-600 text-gray-200 p-1 rounded m-2">
            <p class="font-bold">{answer.votes}</p>
          </div>
          <Button text="Upvote" action={() => postUpvoteAnswer(answer.id)} />
        </div>
      </div>
    </li>
  {/each}
</ul>
