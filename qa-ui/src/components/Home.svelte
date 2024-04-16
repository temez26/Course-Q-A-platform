<script>
  function goToCourses() {
    window.location.href = "/courses";
  }
</script>

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div>
      <img class="mx-auto h-12 w-auto" src="/your-logo.png" alt="Your Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to our platform
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        To get started, click the button below to view our courses.
      </p>
    </div>
    <div class="mt-8 space-y-6">
      <button
        on:click={goToCourses}
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go to Courses
      </button>
    </div>
  </div>
</div>

<style>
</style>
