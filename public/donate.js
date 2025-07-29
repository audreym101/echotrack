document.getElementById("donationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const item = document.getElementById("item").value;
  const description = document.getElementById("description").value;

  const result = document.getElementById("donationResult");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
      return;
    }
    const response = await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ name, email, item, description })
    });
    if (response.ok) {
      result.textContent = `Thank you, ${name}! Your donation of \"${item}\" has been received.`;
      e.target.reset();
    } else {
      const error = await response.json();
      result.textContent = error.message || "Failed to submit donation.";
    }
  } catch (error) {
    result.textContent = "Failed to submit donation. Please try again.";
  }
});
