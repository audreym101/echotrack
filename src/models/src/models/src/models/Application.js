import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: String,
    status: {
      type: String,
      enum: ["submitted", "reviewed", "accepted", "rejected"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
