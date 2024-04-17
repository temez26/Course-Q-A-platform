<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-900 text-white py-8 px-4">
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-semibold text-blue-400">Courses</h3>
        <p class="text-lg">
          &copy; {currentYear} Courses. All rights reserved.
        </p>
      </div>
      <div class="space-x-4">
        <a href="/terms" class="text-lg text-blue-400 hover:text-blue-600"
          >Terms</a
        >
        <a href="/privacy" class="text-lg text-blue-400 hover:text-blue-600"
          >Privacy</a
        >
        <a href="/contact" class="text-lg text-blue-400 hover:text-blue-600"
          >Contact</a
        >
      </div>
    </div>
  </div>
</footer>
