<script>
  import { onMount, onDestroy } from "svelte";
  let courses = [];

  async function fetchCourses() {
    const response = await fetch("/api/getCourses");
    if (response.ok) {
      courses = await response.json();
      console.log(courses); // Move the console.log here
    } else {
      throw new Error("Error fetching courses");
    }
  }

  async function fetchCourse(courseName) {
    const response = await fetch(`/api/getCourse/${courseName}`);
    if (response.ok) {
      const course = await response.json();
      return course;
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
  console.log(courses);
</script>

<div class="grid grid-cols-2 gap-4">
  {#each courses as course (course.name)}
    <div class="rounded overflow-hidden shadow-lg">
      <img class="w-full" src={course.image} alt={course.name} />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{course.name}</div>
        <p class="text-gray-700 text-base">{course.description}</p>
        <button
          on:click={() => fetchCourse(course.name)}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Course
        </button>
      </div>
    </div>
  {/each}
</div>
