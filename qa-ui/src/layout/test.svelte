<script>
    import { userUuid } from "../stores/stores.js";
  
    const callEndpoint = async () => {
      console.log("callEndpoint triggered"); 
  
      try {
        const response = await fetch(`/api/boi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        console.log(jsonData);
        alert(JSON.stringify(jsonData));
      } catch (error) {
        console.error(error);
      }
    };
  </script>
  
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
    on:click={callEndpoint}
  >
    Get Courses
  </button>