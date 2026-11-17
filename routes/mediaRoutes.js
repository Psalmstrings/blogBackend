import express from "express";
import { getMediaItems, addMediaItem, deleteMediaItem } from "../controllers/mediaController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

router.get("/", getMediaItems);
router.post("/", protect, authorize("admin", "superadmin"), upload.single("media"), addMediaItem);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteMediaItem);

export default router;
