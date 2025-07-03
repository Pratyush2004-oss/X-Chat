import express from "express"
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from "../controllers/user.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
// public routes
router.get("/profile/:username", getUserProfile);
// protected routes
router.post('/sync', ProtectRoute, syncUser);
router.post("/me", ProtectRoute, getCurrentUser);
router.put("/profile", ProtectRoute, updateProfile);
router.post('/follow/:targetUserId', ProtectRoute, followUser);

export default router;