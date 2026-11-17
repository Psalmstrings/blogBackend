import express from "express";
import { trackPageView, getAnalyticsStats } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public tracking endpoint (called by frontend on page views)
router.post("/track", trackPageView);

// Admin-only stats endpoint
router.get("/stats", protect, authorize("admin", "superadmin"), getAnalyticsStats);

export default router;
