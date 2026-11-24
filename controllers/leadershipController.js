import Leadership from "../models/Leadership.js";
import AuditLog from "../models/AuditLog.js";

// GET ALL (Public, filtered by active administration or all active)
export const getLeadershipProfiles = async (req, res) => {
  try {
    const { category, administration, featured, isAppointee } = req.query;
    const filter = { status: "active" };

    if (category) filter.category = category;
    if (administration) filter.administration = administration;
    if (featured === "true") filter.isFeatured = true;
    if (isAppointee === "true") {
      filter.$or = [
        { isAppointee: true },
        { category: { $in: ["Appointee", "Appointee (Office of the PRO)"] } }
      ];
    }

    const profiles = await Leadership.find(filter).sort({ displayPriority: 1, createdAt: -1 });
    res.json({ success: true, count: profiles.length, profiles });
  } catch (err) {
    console.error("Error fetching leadership profiles:", err);
    res.status(500).json({ success: false, message: "Failed to fetch leadership profiles" });
  }
};

// GET ALL FOR ADMIN (Includes drafts, archived)
export const getAllLeadershipAdmin = async (req, res) => {
  try {
    const profiles = await Leadership.find().sort({ displayPriority: 1, createdAt: -1 });
    res.json({ success: true, count: profiles.length, profiles });
  } catch (err) {
    console.error("Error fetching leadership admin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET BY ID
export const getLeadershipById = async (req, res) => {
  try {
    const profile = await Leadership.findById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE LEADERSHIP PROFILE
export const createLeadershipProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.photo = req.file.path; // Cloudinary uploaded URL
    }

    if (typeof data.responsibilities === "string") {
      data.responsibilities = data.responsibilities.split("\n").map(r => r.trim()).filter(Boolean);
    }

    if (data.isAppointee !== undefined) {
      data.isAppointee = data.isAppointee === "true" || data.isAppointee === true;
    } else if (data.category === "Appointee" || data.category === "Appointee (Office of the PRO)") {
      data.isAppointee = true;
    }

    if (data.isFeatured !== undefined) {
      data.isFeatured = data.isFeatured === "true" || data.isFeatured === true;
    }

    if (data.displayPriority !== undefined) {
      data.displayPriority = Number(data.displayPriority) || 0;
    }

    const profile = await Leadership.create(data);

    // Audit log
    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "CREATE_LEADERSHIP_PROFILE",
      module: "Leadership",
      targetId: profile._id.toString(),
      details: { name: profile.fullName, position: profile.position, category: profile.category, isAppointee: profile.isAppointee },
    });

    res.status(201).json({ success: true, message: "Leadership profile created", profile });
  } catch (err) {
    console.error("Error creating leadership profile:", err);
    res.status(500).json({ success: false, message: "Failed to create leadership profile", error: err.message });
  }
};

// UPDATE LEADERSHIP PROFILE
export const updateLeadershipProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.photo = req.file.path;
    }

    if (typeof data.responsibilities === "string") {
      data.responsibilities = data.responsibilities.split("\n").map(r => r.trim()).filter(Boolean);
    }

    if (data.isAppointee !== undefined) {
      data.isAppointee = data.isAppointee === "true" || data.isAppointee === true;
    } else if (data.category === "Appointee" || data.category === "Appointee (Office of the PRO)") {
      data.isAppointee = true;
    }

    if (data.isFeatured !== undefined) {
      data.isFeatured = data.isFeatured === "true" || data.isFeatured === true;
    }

    if (data.displayPriority !== undefined) {
      data.displayPriority = Number(data.displayPriority) || 0;
    }

    const updated = await Leadership.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Profile not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "UPDATE_LEADERSHIP_PROFILE",
      module: "Leadership",
      targetId: updated._id.toString(),
      details: { name: updated.fullName, position: updated.position, category: updated.category, isAppointee: updated.isAppointee },
    });

    res.json({ success: true, message: "Leadership profile updated", profile: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
  }
};

// DELETE LEADERSHIP PROFILE
export const deleteLeadershipProfile = async (req, res) => {
  try {
    const deleted = await Leadership.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Profile not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "DELETE_LEADERSHIP_PROFILE",
      module: "Leadership",
      targetId: req.params.id,
      details: { name: deleted.fullName, position: deleted.position },
    });

    res.json({ success: true, message: "Leadership profile deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
