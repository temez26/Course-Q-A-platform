<script>
  import { onMount } from "svelte";
  import { courseId, courses, coursepage, question } from "../stores/stores.js";
  import { fetchCourses, selectCourse } from "../api/apicalls.js";

  onMount(async () => {
    const fetchedCourses = await fetchCourses();

    if (window.location.href.includes("courses")) {
      courses.set(fetchedCourses);
      coursepage.set(0);
      question.set("");
    }
  });
</script>

<div
  class="text-5xl font-bold mb-4 bg-gray-900 bg-opacity-80 text-white text-opacity-95 rounded p-8 w-full"
>
  Select any course you want
</div>
<div
  class="flex flex-col space-y-6 rounded bg-gray-800 bg-opacity-80 text-white p-6 mx-6"
>
  {#each $courses as course (course.id)}
    <div
      class="rounded overflow-hidden shadow-lg bg-gray-900 transition-all duration-500 ease-in-out transform hover:rotate-1"
    >
      <div class="px-6 py-4">
        <div class="font-bold text-2xl text-blue-300 mb-2">{course.name}</div>
        <p class="text-lg mb-2">{course.description}</p>
        <button
          on:click={() => selectCourse(course.id, courseId)}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Course
        </button>
      </div>
    </div>
  {/each}
</div>
