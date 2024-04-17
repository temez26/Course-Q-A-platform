<script>
  import { onMount, onDestroy } from "svelte";
  import { courseId } from "../stores/stores.js";
  let courses = [];

  async function fetchCourses() {
    const response = await fetch("/api/getCourses");
    if (response.ok) {
      courses = await response.json();
      console.log(courses);
    } else {
      throw new Error("Error fetching courses");
    }
  }

  let cleanup;

  onMount(async () => {
    await fetchCourses();
    cleanup = () => {};
  });

  onDestroy(() => {
    if (cleanup) cleanup();
  });

  function selectCourse(id) {
    $courseId = id;
    window.location.href = `/course`;
  }
</script>

<div
  class="flex flex-col space-y-6 rounded bg-gray-800 bg-opacity-75 text-white p-6"
>
  {#each courses as course (course.id)}
    <div
      class="rounded overflow-hidden shadow-lg bg-gray-900 transition-all duration-500 ease-in-out transform hover:scale-105"
    >
      <div class="px-6 py-4">
        <div class="font-bold text-2xl text-blue-300 mb-2">{course.name}</div>
        <p class="text-lg">{course.description}</p>
        <button
          on:click={() => selectCourse(course.id)}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Course
        </button>
      </div>
    </div>
  {/each}
</div>
