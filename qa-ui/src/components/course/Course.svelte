<script>
  async function callApi(path, method = "GET", body = {}) {
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      message = await response.text();
    } else {
      message = "Error: " + response.status;
    }
  }
</script>

<div>
  <h1>Welcome to the course page</h1>
</div>

<style>
</style>
