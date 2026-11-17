import express from "express";
import {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/submit", submitInquiry);
router.get("/", protect, authorize("admin", "superadmin"), getInquiries);
router.put("/:id", protect, authorize("admin", "superadmin"), updateInquiryStatus);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteInquiry);

export default router;
