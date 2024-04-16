<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { courseId } from "../stores/stores.js"; // import courseId from the store
  
  let course = [];
  
  async function fetchCourse() {
    
   let coursei = get(courseId); // get the courseId from the store
   console.log(coursei);
  const response = await fetch(`/api/getCourse?courseId=${coursei}`, { 
    method: "GET",
  });
  if (response.ok) {
    course = await response.json();
    console.log(courseId);
  } else {
    throw new Error("Error fetching course");
  }
}

 
</script>

<div>
  <h1>Welcome to the course page</h1>
  <h2>{$courseId}</h2>
  <a href="/courses">Back to Courses</a>
</div>

<style>
</style>