import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { auth, hasRole } from "../middleware/auth.js";

const router = express.Router();

// Public: GET /jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// Admin: POST /jobs
router.post("/", auth, hasRole("sys-admin", "ngo-admin"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const job = await Job.create({
      title,
      description,
      createdBy: req.user._id
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Job-seeker: POST /jobs/:id/apply
router.post("/:id/apply", auth, hasRole("job-seeker"), async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const application = await Application.create({
      job: req.params.id,
      applicant: req.user._id,
      coverLetter
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin/NGO: GET /jobs/:id/applications
router.get("/:id/applications", auth, hasRole("sys-admin", "ngo-admin"), async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate("applicant", "name email role")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
