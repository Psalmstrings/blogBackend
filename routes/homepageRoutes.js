import express from "express";
import { getHomepageData, updateHomepageData } from "../controllers/homepageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

router.get("/", getHomepageData);
router.put(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "proImage", maxCount: 1 },
  ]),
  updateHomepageData
);

export default router;
