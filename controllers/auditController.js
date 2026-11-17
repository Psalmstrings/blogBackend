import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { module, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (module) filter.module = module;

    const skip = (Number(page) - 1) * Number(limit);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({ success: true, total, page: Number(page), logs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
};
