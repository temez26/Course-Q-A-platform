<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 mb-4 shadow flex justify-between">
  <span class="text-2xl text-gray-700 font-serif"
    >Courses for user: {$userUuid}!</span
  >
  <ul class="flex space-x-4">
    <li>
      <a
        class="text-lg font-semibold text-gray-600 hover:text-gray-900"
        href="/">Home</a
      >
    </li>
    <li>
      <a
        class="text-lg font-semibold text-gray-600 hover:text-gray-900"
        href="/courses">Courses</a
      >
    </li>
    <li>
      <a
        class="text-lg font-semibold text-gray-600 hover:text-gray-900"
        href="/course">Course</a
      >
    </li>
  </ul>
</nav>
