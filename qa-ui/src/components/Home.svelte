<script>
  import Button from "./shared/Button.svelte";
</script>

<div class="min-h-screen flex items-center justify-center text-white">
  <div class="text-center space-y-8">
    <h1 class="text-8xl font-bold text-blue-300">Welcome to Our Courses</h1>
    <p class="text-4xl">Click the button below to view our courses.</p>
    <a href="/courses">
      <Button
        text="Courses"
        className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-4 px-8 m-5 text-3xl rounded"
      />
    </a>
  </div>
</div>
