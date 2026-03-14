import express from "express";
import {
  registerAdmin,
  loginAdmin,
  registerBlogger,
  loginBlogger,
  getBloggers
} from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

router.post("/blogger/register", registerBlogger);
router.post("/blogger/login", loginBlogger);

router.get("/bloggers", getBloggers);
// router.get("/admins", getAdmins);
// router.get

export default router;