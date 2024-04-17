<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { courseId, currentCourse } from "../stores/stores.js";

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

<div class="bg-gray-800 bg-opacity-75 text-white p-6">
  <h1 class="text-3xl font-bold text-blue-300 mb-4">
    Welcome to the course page
  </h1>
  {#if course}
    <div class="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold text-blue-300 mb-2">{course.name}</h2>
      <p class="text-lg">{course.description}</p>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
  <a href="/courses">
    <button
      class="mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      Back to Courses
    </button>
  </a>
</div>
