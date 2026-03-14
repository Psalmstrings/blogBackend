import express from "express";
import {
  createNews,
  getHeadlines,
  getNews,
  getNewsById,
  editNews,
  deleteNews
} from "../controllers/newsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly, bloggerOnly } from "../middleware/roleMiddleware.js";
// import uploadBlogImage from "../middleware/uploadBlogImage.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadCloud.js";

const router = express.Router();

// --- STATIC ROUTES (must be FIRST and UNIQUE) ---
router.get("/get/all", getNews);
router.get("/headlines", getHeadlines);

// --- DYNAMIC ROUTE ---
router.get("/:id", getNewsById);

// --- PROTECTED ROUTES ---
router.post("/create", protect, authorize("admin", "blogger"), upload.single("coverImage"),createNews);
router.put("/:id", protect, editNews);
router.delete("/:id", protect, deleteNews);

export default router;