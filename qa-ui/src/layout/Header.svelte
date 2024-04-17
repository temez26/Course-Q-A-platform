<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-8 mb-4 shadow flex justify-between bg-gray-900 text-white">
  <span class="text-4xl text-blue-300 font-serif"
    >Courses for user: {$userUuid}!</span
  >
  <ul class="flex space-x-4">
    <li>
      <a
        class="text-2xl font-semibold text-blue-400 hover:text-blue-600"
        href="/">Home</a
      >
    </li>
    <li>
      <a
        class="text-2xl font-semibold text-blue-400 hover:text-blue-600"
        href="/courses">Courses</a
      >
    </li>
    <li>
      <a
        class="text-2xl font-semibold text-blue-400 hover:text-blue-600"
        href="/course">Course</a
      >
    </li>
  </ul>
</nav>
