<script>
  import { userUuid } from "../stores/stores.js";
  let isOpen = false;
</script>

<nav
  class="p-6 mb-4 shadow flex flex-wrap bg-black bg-opacity-10 justify-between text-white border-b border-gray-500"
>
  <div class="flex justify-between w-full  ">
    <div class="mr-4">
      <span class="text-2xl text-gray-200 font-semibold"
        >Courses for user: {$userUuid}!</span
      >
    </div>
    <div class="flex flex-col lg:flex-row ">
      <button class="lg:hidden" on:click={() => (isOpen = !isOpen)}>
        Menu
      </button>
      <ul
        class={`${
          isOpen ? "block" : "hidden"
        } ml-0 lg:ml-4 w-full lg:w-auto lg:flex space-x-0 lg:space-x-4 transition-all duration-200 ease-in-out`}
      >
        <li>
          <a
            class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-gray-500 hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
            href="/">Home</a
          >
        </li>
        <li>
          <a
            class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-gray-500 hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
            href="/courses">Courses</a
          >
        </li>
        <li>
          <a
            class="text-2xl font-semibold text-gray-300 hover:text-white hover:bg-gray-500 hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
            href="/course">Course</a
          >
        </li>
      </ul>
    </div>
  </div>
  
</nav>