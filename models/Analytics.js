import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
    },
    referrer: {
      type: String,
      default: "direct",
    },
    ip: {
      type: String,
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      enum: ["Mobile", "Desktop", "Tablet", "Unknown"],
      default: "Desktop",
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    country: {
      type: String,
      default: "Nigeria",
      index: true,
    },
    region: {
      type: String,
      default: "Southwest Zone D",
      index: true,
    },
    city: {
      type: String,
      default: "Lagos",
    },
    sessionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast aggregation
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ region: 1, country: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
