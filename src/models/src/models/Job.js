import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // admin/ngo-admin
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
