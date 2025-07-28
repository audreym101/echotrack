function loadView(view) {
  const content = document.getElementById("content");
  let html = "";

  switch(view) {
    case "admin":
      html = "<h2>System Admin Panel</h2><p>Manage users, roles, and platform settings.</p>";
      break;
    case "donor":
      html = "<h2>Donor Dashboard</h2><p>Track donations and view donation history.</p>";
      break;
    case "ngo":
      html = "<h2>NGO Admin Dashboard</h2><p>Manage donation requests and reports.</p>";
      break;
    case "job":
      html = "<h2>Job Seeker Dashboard</h2><p>Search for jobs and manage your applications.</p>";
      break;
    default:
      html = "<p>Select a role to view your dashboard.</p>";
  }

  content.innerHTML = html;
}
