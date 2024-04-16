<script>
  import { userUuid, currentCourse } from "../stores/stores.js";

  let question = "";

  const askSomething = async () => {
    const data = {
      user: $userUuid,
      question: question,
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
    alert(JSON.stringify(jsonData));
  };
</script>

<input
  type="text"
  bind:value={question}
  class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
  placeholder="Enter your question here"
/>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
  on:click={askSomething}
>
  Ask!
</button>
