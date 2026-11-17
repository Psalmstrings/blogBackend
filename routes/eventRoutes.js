import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createEvent);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateEvent);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteEvent);

export default router;
