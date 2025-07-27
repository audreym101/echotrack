import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["submitted", "reviewed", "accepted", "rejected"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Donation", DonationSchema);
