<script>
  import { onMount, onDestroy } from "svelte";
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

  async function fetchCourse(courseId) {
    const response = await fetch(`/api/getCourse?courseId=${courseId}`, {
      method: "GET",
    });
    if (response.ok) {
      const course = await response.json();
      console.log(course);
    } else {
      throw new Error("Error fetching course");
    }
  }

  let cleanup;

  onMount(async () => {
    await fetchCourses();
    cleanup = () => {
      // perform cleanup here
    };
  });

  onDestroy(() => {
    if (cleanup) cleanup();
  });
</script>

<div class="grid grid-cols-2 gap-4">
  {#each courses as course (course.id)}
    <div class="rounded overflow-hidden shadow-lg">
      <img class="w-full" src={course.image} alt={course.name} />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{course.name}</div>
        <p class="text-gray-700 text-base">{course.description}</p>
        <button
          on:click={() => fetchCourse(course.id)}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Course
        </button>
      </div>
    </div>
  {/each}
</div>
