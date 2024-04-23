<script>
  import { courseId } from "../../stores/stores.js";
  import { selectCourse } from "../../api/apicalls.js";
  export let course;
</script>

<div
  class="rounded overflow-hidden shadow-lg bg-gray-900 transition-all duration-500 ease-in-out transform hover:rotate-1"
>
  <div class="px-6 py-4">
    <div class="font-bold text-2xl text-blue-300 mb-2">{course.name}</div>
    <p class="text-lg mb-2">{course.description}</p>
    <button
      on:click={() => {
        courseId.set(course.id);
        selectCourse(course.id);
      }}
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      View Course
    </button>
  </div>
</div>
