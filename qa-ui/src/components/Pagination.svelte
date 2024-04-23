<script>
  import Button from "./Button.svelte";
  export let nextPage = () => {};
  export let prevPage = () => {};
  export let page = 0;
</script>

<div class="bg-gray-800 p-4 rounded">
  <Button text="Previous" action={prevPage} />
  <span class="bg-gray-700 text-white font-bold py-2 px-4 rounded">
    Page {page + 1}
  </span>
  <Button text="Next" action={nextPage} />
</div>
