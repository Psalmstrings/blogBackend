import express from "express";
import {
  registerAdmin,
  loginAdmin,
  registerBlogger,
  loginBlogger,
  getBloggers,
  getAdmins,
  toggleBloggerStatus,
  deleteBlogger,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin auth
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.get("/admins", protect, authorize("admin", "superadmin"), getAdmins);

// Blogger auth (Creation is strictly Admin-only)
router.post("/blogger/register", protect, authorize("admin", "superadmin"), registerBlogger);
router.post("/blogger/create", protect, authorize("admin", "superadmin"), registerBlogger);
router.post("/blogger/login", loginBlogger);

// Blogger management by admin
router.get("/bloggers", protect, authorize("admin", "superadmin"), getBloggers);
router.put("/bloggers/:id/toggle", protect, authorize("admin", "superadmin"), toggleBloggerStatus);
router.delete("/bloggers/:id", protect, authorize("admin", "superadmin"), deleteBlogger);

export default router;
