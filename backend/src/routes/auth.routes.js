import express from "express";
const router = express.Router();

import { signup, login, logout, updateProfile } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update", protectedRoute, updateProfile);

router.get("/check", protectedRoute, (req, res) => res.status(200).json(req.user));

export default router;
