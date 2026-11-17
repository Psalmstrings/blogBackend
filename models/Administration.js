import mongoose from "mongoose";

const administrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // e.g. "2026-2027 Administration"
    session: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. "2026-2027"
    theme: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Administration", administrationSchema);
