<script>
  import { onMount } from "svelte";
  import { courseId } from "../stores/stores.js";
  let course = null;
  async function fetchCourse() {
    const response = await fetch(`/api/getCourse?courseId=${$courseId}`, {
      method: "GET",
    });
    if (response.ok) {
      course = await response.json();
      console.log($courseId);
    } else {
      throw new Error("Error fetching course");
    }
  }
</script>

<div>
  <h1>Welcome to the course page</h1>
  <button on:click={() => fetchCourse()}>get course</button>
  {#if course}
    <div class="font-bold text-xl mb-2">{course[0].name}</div>
    <p class="text-gray-700 text-base">{course[0].description}</p>
  {/if}
  <a href="/courses">Back to Courses</a>
</div>

<style>
</style>