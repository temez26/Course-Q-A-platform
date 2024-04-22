export async function apiCall(url, method, body = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  console.log(response, "for", url, "with", method, "and", body);

  if (!response.ok) {
    console.error(`Error with ${method} request to ${url}`);
  }

  return response.json();
}
