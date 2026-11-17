import express from "express";
import { getAllUsers, suspendUser, reactivateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/getusers", protect, authorize("admin", "superadmin"), getAllUsers);
router.put("/suspend/:id", protect, authorize("admin", "superadmin"), suspendUser);
router.put("/reactivate/:id", protect, authorize("admin", "superadmin"), reactivateUser);

export default router;
