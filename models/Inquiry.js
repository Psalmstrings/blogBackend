import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Inquiry", "Complaint", "Suggestion", "Media Request", "General"],
      default: "Inquiry",
    },
    status: {
      type: String,
      enum: ["New", "In Review", "Resolved", "Archived"],
      default: "New",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
