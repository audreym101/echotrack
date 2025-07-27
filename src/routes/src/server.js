import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donations.js";
import jobRoutes from "./routes/jobs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Eco-Textile API is running"));

app.use("/auth", authRoutes);
app.use("/donations", donationRoutes);
app.use("/jobs", jobRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`🚀 Server listening on http://localhost:${port}`));
});
