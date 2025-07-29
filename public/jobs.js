const jobList = document.getElementById("jobList");

const jobs = [
  { title: "Tailor", description: "Sew eco-friendly pads for local schools." },
  { title: "Cleaner", description: "Assist in maintaining a hygienic environment for the tailoring center." },
  { title: "Logistics Assistant", description: "Help with collection and delivery of textile donations." }
];

jobs.forEach(job => {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${job.title}</strong><p>${job.description}</p>`;
  jobList.appendChild(li);
});
