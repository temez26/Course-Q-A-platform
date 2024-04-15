<script>
  import { onMount } from "svelte";

  let message = "";

  onMount(async () => {
    const response = await fetch("/api/boi");
    if (response.ok) {
      message = await response.text();
    } else {
      message = "Error: " + response.status;
    }
  });
</script>

<main>
  <h1>{message}</h1>
</main>
