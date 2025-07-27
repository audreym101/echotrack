import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["sys-admin", "ngo-admin", "donor", "job-seeker"],
      default: "donor"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
