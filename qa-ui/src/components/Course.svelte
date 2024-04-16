<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { courseId } from "../stores/stores.js"; // import courseId from the store

  let course = null;

  async function fetchCourse() {
    let coursei = get(courseId); // get the courseId from the store
    console.log(coursei);
    const response = await fetch(`/api/getCourse?courseId=${coursei}`, {
      method: "GET",
    });
    if (response.ok) {
      let result = await response.json();
      course = result[0];
      console.log(course.name);
      console.log(course.description);
    } else {
      throw new Error("Error fetching course");
    }
  }

  onMount(fetchCourse); // fetch the course when the component is mounted
</script>

<div>
  <h1>Welcome to the course page</h1>
  {#if course}
    <h2>{course.name}</h2>
    <p>{course.description}</p>
  {:else}
    <p>Loading...</p>
  {/if}
  <a href="/courses">Back to Courses</a>
</div>

<style>
</style>
