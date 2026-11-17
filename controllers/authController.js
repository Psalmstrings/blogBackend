import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Blogger from "../models/Blogger.js";
import AuditLog from "../models/AuditLog.js";

// JWT creation helper
const createToken = (user, type = "admin") => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role || (type === "admin" ? "admin" : "blogger"),
      type 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ------------------ ADMIN ------------------

// ADMIN REGISTER (Secured: requires admin token or setup key if creating first admin)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, setupKey, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const adminCount = await Admin.countDocuments();

    // If an admin already exists, check authorization
    if (adminCount > 0) {
      const authHeader = req.headers.authorization;
      const validSetupKey = process.env.ADMIN_SETUP_KEY || "NANS_ZONE_D_SECURE_SETUP_2026";

      let authorized = false;
      if (setupKey && setupKey === validSetupKey) {
        authorized = true;
      } else if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
          if (decoded && (decoded.role === "admin" || decoded.role === "superadmin")) {
            authorized = true;
          }
        } catch (e) {
          authorized = false;
        }
      }

      if (!authorized) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Administrator registration is protected. Only existing administrators or authorized setup keys can create new administrators."
        });
      }
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: "Admin with this email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const assignedRole = role || (adminCount === 0 ? "superadmin" : "admin");

    const admin = await Admin.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashed,
      role: assignedRole 
    });

    await AuditLog.create({
      adminId: admin._id,
      adminEmail: admin.email,
      action: "REGISTER_ADMIN",
      module: "Auth",
      targetId: admin._id.toString(),
      details: { email: admin.email, role: admin.role }
    });

    const { password: _, ...adminData } = admin._doc;
    res.status(201).json({ success: true, message: "Admin registered successfully", admin: adminData });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(400).json({ success: false, message: "Invalid email or password" });

    if (admin.isActive === false) {
      return res.status(403).json({ success: false, message: "This administrative account is suspended" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = createToken(admin, "admin");
    const { password: _, ...adminData } = admin._doc;

    res.cookie("token", token, { 
      httpOnly: true, 
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production"
    });

    await AuditLog.create({
      adminId: admin._id,
      adminEmail: admin.email,
      action: "LOGIN_ADMIN",
      module: "Auth",
      targetId: admin._id.toString(),
      details: { ip: req.ip }
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: adminData,
      role: admin.role,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET ALL ADMINS
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ BLOGGER ------------------

// BLOGGER REGISTER (Admin restricted)
export const registerBlogger = async (req, res) => {
  try {
    const { name, email, password, bio, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const exists = await Blogger.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: "A blogger with this email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const blogger = await Blogger.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      bio: bio || "",
      avatar: avatar || "",
      role: "blogger",
      status: "active",
      isSuspended: false,
    });

    // Create Audit Log
    if (req.user) {
      await AuditLog.create({
        adminId: req.user.id,
        adminEmail: req.user.email || "Admin",
        action: "CREATE_BLOGGER",
        module: "Auth",
        targetId: blogger._id.toString(),
        details: { name: blogger.name, email: blogger.email }
      });
    }

    const { password: _, ...bloggerData } = blogger._doc;
    res.status(201).json({ success: true, message: "Blogger account created successfully", blogger: bloggerData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// BLOGGER LOGIN
export const loginBlogger = async (req, res) => {
  try {
    const { email, password } = req.body;

    const blogger = await Blogger.findOne({ email: email.toLowerCase() });
    if (!blogger) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (blogger.status === "suspended") {
      return res.status(403).json({ success: false, message: "Your blogger account is suspended. Contact admin." });
    }

    const match = await bcrypt.compare(password, blogger.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(blogger, "blogger");

    res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });

    return res.status(200).json({
      success: true,
      message: "Blogger logged in successfully",
      token,
      blogger: {
        id: blogger._id,
        name: blogger.name,
        email: blogger.email,
        role: blogger.role || "blogger",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET ALL BLOGGERS
export const getBloggers = async (req, res) => {
  try {
    const bloggers = await Blogger.find().select("-password");
    res.status(200).json(bloggers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// SUSPEND / ACTIVATE BLOGGER
export const toggleBloggerStatus = async (req, res) => {
  try {
    const blogger = await Blogger.findById(req.params.id);
    if (!blogger) return res.status(404).json({ success: false, message: "Blogger not found" });

    blogger.status = blogger.status === "active" ? "suspended" : "active";
    await blogger.save();

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "TOGGLE_BLOGGER_STATUS",
      module: "Auth",
      targetId: blogger._id.toString(),
      details: { email: blogger.email, status: blogger.status }
    });

    res.status(200).json({ success: true, message: `Blogger ${blogger.status}`, blogger });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE BLOGGER
export const deleteBlogger = async (req, res) => {
  try {
    const blogger = await Blogger.findByIdAndDelete(req.params.id);
    if (!blogger) return res.status(404).json({ success: false, message: "Blogger not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "DELETE_BLOGGER",
      module: "Auth",
      targetId: req.params.id,
      details: { email: blogger.email }
    });

    res.status(200).json({ success: true, message: "Blogger deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
