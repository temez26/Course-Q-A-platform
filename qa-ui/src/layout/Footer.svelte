<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-900 text-white py-8 px-4">
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold">Courses</h3>
        <p class="text-sm">
          &copy; {currentYear} Courses. All rights reserved.
        </p>
      </div>
      <div class="space-x-4">
        <a href="/terms" class="text-sm hover:underline">Terms</a>
        <a href="/privacy" class="text-sm hover:underline">Privacy</a>
        <a href="/contact" class="text-sm hover:underline">Contact</a>
      </div>
    </div>
  </div>
</footer>
