import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "superadmin"), getAuditLogs);

export default router;
