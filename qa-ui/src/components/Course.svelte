<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { courseId, currentCourse } from "../stores/stores.js"; // import the currentCourse store

  let course = null;

  async function fetchCourse() {
    let coursei = get(courseId);
    console.log(coursei);
    const response = await fetch(`/api/getCourse?courseId=${coursei}`, {
      method: "GET",
    });
    if (response.ok) {
      let result = await response.json();
      course = result[0];
      currentCourse.set(course);
      console.log(course.name);
      console.log(course.description);
    } else {
      throw new Error("Error fetching course");
    }
  }

  onMount(fetchCourse);
</script>

<div>
  <h1>Welcome to the course page</h1>
  {#if course}
    <h2>{course.name}</h2>
    <p>{course.description}</p>
  {:else}
    <p>Loading...</p>
  {/if}
  <a href="/courses">
    <button
      class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      Back to Courses
    </button></a
  >
</div>

<style>
</style>
