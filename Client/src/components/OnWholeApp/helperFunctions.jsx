// Not using currently, may use in future

export const postData = async (url, data) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error, Status: ${res.status}`);
    }

    const result = await res.json();
    console.log("Response from server:", result);
  } catch (err) {
    console.log("Error in sending Data:", err);
  }
};
