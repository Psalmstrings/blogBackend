import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminEmail: {
      type: String,
      default: "System",
    },
    action: {
      type: String,
      required: true,
    }, // e.g. "UPDATE_HOMEPAGE", "APPROVE_NEWS", "CREATE_LEADERSHIP"
    module: {
      type: String,
      required: true,
    }, // e.g. "Homepage", "News", "Leadership", "Auth"
    targetId: {
      type: String,
      default: "",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
