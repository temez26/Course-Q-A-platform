<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-black bg-opacity-50 text-white py-6 px-4">
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-semibold text-gray-200">Courses</h3>
        <p class="text-lg">
          &copy; {currentYear} Courses. All rights reserved.
        </p>
      </div>
      <div class="space-x-4">
        <a
          href="/terms"
          class="text-lg text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
          >Terms</a
        >
        <a
          href="/privacy"
          class="text-lg text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
          >Privacy</a
        >
        <a
          href="/contact"
          class="text-lg text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 ease-in-out rounded px-2"
          >Contact</a
        >
      </div>
    </div>
  </div>
</footer>
