<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav
  class="p-6 mb-4 shadow flex bg-black bg-opacity-10 justify-between text-white border-b border-gray-500"
>
  <span class="text-4xl text-gray-200 font-serif"
    >Courses for user: {$userUuid}!</span
  >
  <ul class="flex space-x-4">
    <li>
      <a
        class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
        href="/">Home</a
      >
    </li>
    <li>
      <a
        class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
        href="/courses">Courses</a
      >
    </li>
    <li>
      <a
        class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
        href="/course">Course</a
      >
    </li>
  </ul>
</nav>
