export async function apiGet(path, signal) {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    signal
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}
