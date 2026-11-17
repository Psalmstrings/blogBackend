import express from "express";
import {
  getLeadershipProfiles,
  getAllLeadershipAdmin,
  getLeadershipById,
  createLeadershipProfile,
  updateLeadershipProfile,
  deleteLeadershipProfile,
} from "../controllers/leadershipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

// Public routes
router.get("/", getLeadershipProfiles);
router.get("/:id", getLeadershipById);

// Admin protected routes
router.get("/admin/all", protect, authorize("admin", "superadmin"), getAllLeadershipAdmin);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("photo"),
  createLeadershipProfile
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  upload.single("photo"),
  updateLeadershipProfile
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteLeadershipProfile);

export default router;
