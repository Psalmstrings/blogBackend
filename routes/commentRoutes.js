import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:newsId", addComment);
router.get("/:newsId", getComments);

export default router;