import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Blogger from "../models/Blogger.js";

// JWT creation helper
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || "blogger" }, // role defaults to blogger if missing
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ------------------ ADMIN ------------------

// ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashed });

    // Hide password
    const { password: _, ...adminData } = admin._doc;

    res.status(201).json({ message: "Admin registered", admin: adminData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = createToken(admin);

    const { password: _, ...adminData } = admin._doc;

    // Optionally send token in cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });

    res.status(200).json({
      message: "Admin logged in successfully",
      token,       // <-- token returned explicitly
      admin: adminData,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ------------------ BLOGGER ------------------

// BLOGGER REGISTER
export const registerBlogger = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Blogger.findOne({ email });
    if (exists) return res.status(400).json({ message: "Blogger already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const blogger = await Blogger.create({ name, email, password: hashed });

    const { password: _, ...bloggerData } = blogger._doc;

    res.status(201).json({ message: "Blogger registered", blogger: bloggerData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// BLOGGER LOGIN
export const loginBlogger = async (req, res) => {
  try {
    const { email, password } = req.body;

    const blogger = await Blogger.findOne({ email });
    if (!blogger) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, blogger.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(blogger);

    // optional cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });

    return res.status(200).json({
      message: "Blogger logged successfully",
      token,
      blogger: {
        id: blogger._id,
        name: blogger.name,
        email: blogger.email,
        role: blogger.role,   // ✅ role added
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
// ------------------ BLOGGER MANAGEMENT (ADMIN ONLY) ------------------

// GET ALL BLOGGERS
export const getBloggers = async (req, res) => {
  try {
    const bloggers = await Blogger.find().select("-password");
    res.status(200).json(bloggers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// SUSPEND / ACTIVATE BLOGGER
export const toggleBloggerStatus = async (req, res) => {
  try {
    const blogger = await Blogger.findById(req.params.id);
    if (!blogger) return res.status(404).json({ message: "Blogger not found" });

    // Corrected status toggling
    blogger.status = blogger.status === "active" ? "suspended" : "active";
    await blogger.save();

    res.status(200).json({ message: `Blogger ${blogger.status}`, blogger });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// DELETE BLOGGER
export const deleteBlogger = async (req, res) => {
  try {
    const blogger = await Blogger.findByIdAndDelete(req.params.id);
    if (!blogger) return res.status(404).json({ message: "Blogger not found" });

    res.status(200).json({ message: "Blogger deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};