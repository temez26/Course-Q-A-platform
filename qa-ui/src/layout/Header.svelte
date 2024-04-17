<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-8 mb-4 shadow flex justify-between bg-gray-800 text-white">
  <span class="text-2xl text-blue-300 font-serif"
    >Courses for user: {$userUuid}!</span
  >
  <ul class="flex space-x-4">
    <li>
      <a
        class="text-lg font-semibold text-blue-300 hover:text-blue-500"
        href="/">Home</a
      >
    </li>
    <li>
      <a
        class="text-lg font-semibold text-blue-300 hover:text-blue-500"
        href="/courses">Courses</a
      >
    </li>
    <li>
      <a
        class="text-lg font-semibold text-blue-300 hover:text-blue-500"
        href="/course">Course</a
      >
    </li>
  </ul>
</nav>
