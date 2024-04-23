<script>
  export let text = "";
  export let action = () => {};
  export let className = "bg-green-700 hover:bg-green-900 ";
</script>

<button
  class={`text-white font-bold py-2 px-4 rounded ${className}`}
  on:click={action}
>
  {text}
</button>
