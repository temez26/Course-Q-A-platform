<script>
  import { onMount } from "svelte";
  import CoursesList from "./shared/CoursesList.svelte";
  import { courses, question } from "../stores/stores.js";
  import { fetchCourses } from "../api/apicalls.js";

  onMount(async () => {
    fetchCourses();

    if (window.location.href.includes("courses")) {
      question.set("");
    }
  });
</script>

<div
  class="text-5xl font-bold mb-4 bg-gray-900 bg-opacity-80 text-gray-100 text-opacity-95 rounded p-8 w-full"
>
  Select any course you want
</div>
<div
  class="flex flex-col space-y-6 rounded bg-gray-800 bg-opacity-80 text-white p-6 mx-6"
>
  {#each $courses as course (course.id)}
    <CoursesList {course} />
  {/each}
</div>
