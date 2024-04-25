<script>
  import { question } from "../../stores/stores.js";
  import { askSomething } from "../../api/apicalls.js";
  import Button from "./Button.svelte";
</script>

<h1 class="text-4xl font-bold mb-4 text-gray-100">Questions</h1>

<div class="relative">
  <input
    type="text"
    bind:value={$question}
    class="w-full px-3 py-2 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 pr-20"
    placeholder="Enter your question here"
  />
  <div class="absolute right-0 top-0">
    <Button
      text="Ask!"
      action={async () => {
        askSomething();
        question.set("");
      }}
      className="border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    />
  </div>
</div>
