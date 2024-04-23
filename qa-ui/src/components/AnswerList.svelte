<script>
  import Button from "./Button.svelte";
  export let answers = [];
  import { postUpvoteAnswer } from "../api/apicalls.js";
</script>

<ul>
  {#each answers as answer, j (j)}
    <li class="mb-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <div class="bg-green-500 text-white p-2 rounded mr-2">
            <p class="font-bold">{answer.votes}</p>
          </div>
          <p class="text-lg">{answer.answer}</p>
        </div>
        <Button text="Upvote" on:click={() => postUpvoteAnswer(answer.id)} />
      </div>
    </li>
  {/each}
</ul>
