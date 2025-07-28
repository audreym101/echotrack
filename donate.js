document.getElementById("donationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const item = document.getElementById("item").value;
  const description = document.getElementById("description").value;

  const result = document.getElementById("donationResult");
  result.textContent = `Thank you, ${name}! Your donation of "${item}" has been received.`;

  // Reset form
  e.target.reset();
});
