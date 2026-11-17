import express from "express";
import { getOrgInfo, updateOrgInfo } from "../controllers/orgInfoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

router.get("/", getOrgInfo);
router.put(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("ideologyImage"),
  updateOrgInfo
);

export default router;
