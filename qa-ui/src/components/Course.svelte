<script>
  import { userUuid } from "../stores/stores.js";
  let message = "";

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
  <h1>{message}</h1>

  <!-- Pass userUUID when calling getCourses -->
  <button
    on:click={() => callApi("/api/getCourses", "POST", { userUuid: $userUuid })}
    >Get Courses</button
  >
  <!-- other buttons... -->
</div>

<style>
  button {
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    color: white;
    background-color: #007bff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
