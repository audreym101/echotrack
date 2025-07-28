document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Create user account
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "donor" })
    });

    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem("token", userData._id);
      localStorage.setItem("userData", JSON.stringify(userData));
      alert(`Account created successfully for ${name}!`);
      window.location.href = "dashboard.html";
    } else {
      const error = await response.json();
      alert(error.message || "Failed to create account");
    }
  } catch (error) {
    console.error("Error creating account:", error);
    alert("Failed to create account. Please try again.");
  }
});
