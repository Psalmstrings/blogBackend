import mongoose from "mongoose";

const bloggerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "blogger" },
    status: { type: String, default: "active" }, // admin can suspend
  },
  { timestamps: true }
);

export default mongoose.model("Blogger", bloggerSchema);