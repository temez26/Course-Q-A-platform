<script>
  import Button from "./Button.svelte";
  export let nextPage = () => {};
  export let prevPage = () => {};
  export let page = 0;
</script>

<div class=" p-4 rounded flex justify-center items-center">
  <Button text="Prev" action={prevPage} />
  <span class="bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2">
    Page {page + 1}
  </span>
  <Button text="Next" action={nextPage} />
</div>
