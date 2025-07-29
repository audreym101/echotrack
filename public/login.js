document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Save JWT token and user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong. Try again later.");
  }
});
