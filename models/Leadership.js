import mongoose from "mongoose";

const leadershipSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Executive",
        "Director",
        "Deputy Director",
        "Special Assistant",
        "Senior Special Assistant",
        "Media Aide",
        "Media Team",
        "State PRO",
        "Other",
      ],
      default: "Executive",
    },
    photo: {
      type: String,
      default: "",
    },
    biography: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    institution: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    socialLinks: {
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    administration: {
      type: String,
      default: "2026-2027",
      trim: true,
    },
    displayPriority: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "archived", "draft"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leadership", leadershipSchema);
