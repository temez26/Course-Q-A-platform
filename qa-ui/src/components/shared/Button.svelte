<script>
  export let text = "";
  export let action = () => {};
</script>

<button
  class={`bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded`}
  on:click={action}
>
  {text}
</button>
