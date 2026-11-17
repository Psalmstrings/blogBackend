import express from "express";
import {
  createNews,
  getHeadlines,
  getNews,
  getNewsById,
  editNews,
  approveNews,
  deleteNews,
  getDashboardStats,
} from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

// --- PUBLIC STATIC ROUTES ---
router.get("/get/all", getNews);
router.get("/headlines", getHeadlines);
router.get("/stats", getDashboardStats);

// --- PROTECTED CREATE ROUTE ---
router.post(
  "/create",
  protect,
  authorize("admin", "superadmin", "blogger"),
  upload.single("coverImage"),
  createNews
);

// --- APPROVE ROUTE (Supports both formats for existing frontend) ---
router.put("/:id/approve", protect, authorize("admin", "superadmin"), approveNews);
router.put("/admin/news/:id/approve", protect, authorize("admin", "superadmin"), approveNews);

// --- DELETE ROUTE (Supports both formats) ---
router.delete("/admin/news/:id", protect, authorize("admin", "superadmin"), deleteNews);
router.delete("/:id", protect, authorize("admin", "superadmin", "blogger"), deleteNews);

// --- EDIT ROUTE ---
router.put("/:id", protect, authorize("admin", "superadmin", "blogger"), upload.single("coverImage"), editNews);

// --- DYNAMIC GET ROUTE (must be last) ---
router.get("/:id", getNewsById);

export default router;
