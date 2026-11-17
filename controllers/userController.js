import Blogger from "../models/Blogger.js";
import AuditLog from "../models/AuditLog.js";

// GET ALL USERS (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await Blogger.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SUSPEND USER
export const suspendUser = async (req, res) => {
  try {
    const user = await Blogger.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "suspended";
    user.isSuspended = true;
    await user.save();

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "SUSPEND_USER",
      module: "Users",
      targetId: user._id.toString(),
      details: { email: user.email }
    });

    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REACTIVATE USER
export const reactivateUser = async (req, res) => {
  try {
    const user = await Blogger.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "active";
    user.isSuspended = false;
    await user.save();

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "REACTIVATE_USER",
      module: "Users",
      targetId: user._id.toString(),
      details: { email: user.email }
    });

    res.json({ message: "User reactivated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
