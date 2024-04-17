<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-800 text-white py-8 px-4">
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-semibold text-blue-300">Courses</h3>
        <p class="text-lg">
          &copy; {currentYear} Courses. All rights reserved.
        </p>
      </div>
      <div class="space-x-4">
        <a href="/terms" class="text-lg text-blue-300 hover:text-blue-500"
          >Terms</a
        >
        <a href="/privacy" class="text-lg text-blue-300 hover:text-blue-500"
          >Privacy</a
        >
        <a href="/contact" class="text-lg text-blue-300 hover:text-blue-500"
          >Contact</a
        >
      </div>
    </div>
  </div>
</footer>
