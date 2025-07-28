document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Placeholder for actual signup logic
  alert(`Account created for ${name} (${email})`);
  window.location.href = "role-selection.html"; // redirect after signup
});
