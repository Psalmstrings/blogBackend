import express from "express";
import { getAllUsers, suspendUser, reactivateUser } from "../controllers/userController.js";

const router = express.Router();


router.get("/getusers", getAllUsers);
router.put("/suspend/:id", suspendUser);
router.put("/reactivate/:id", reactivateUser);

export default router;