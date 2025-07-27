import express from "express";
import Donation from "../models/Donation.js";
import { auth, hasRole } from "../middleware/auth.js";

const router = express.Router();

// POST /donations  (donor)
router.post("/", auth, hasRole("donor", "sys-admin", "ngo-admin"), async (req, res) => {
  try {
    const { item, description } = req.body;
    const donation = await Donation.create({
      donor: req.user._id,
      item,
      description
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /donations  (admins / NGO admins see all; donor sees own)
router.get("/", auth, async (req, res) => {
  try {
    const isStaff = ["sys-admin", "ngo-admin"].includes(req.user.role);
    const query = isStaff ? {} : { donor: req.user._id };

    const donations = await Donation.find(query)
      .populate("donor", "name email role")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
