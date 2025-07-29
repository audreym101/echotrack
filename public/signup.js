document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    if (response.ok) {
      alert(`Account created successfully for ${name}! Please login.`);
      window.location.href = "login.html";
    } else {
      const error = await response.json();
      alert(error.message || "Failed to create account");
    }
  } catch (error) {
    console.error("Error creating account:", error);
    alert("Failed to create account. Please try again.");
  }
});
