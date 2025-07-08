import express from "express";
import { createPost, deletePost, getPosts, getSinglePost, getUserPosts, likePost } from "../controllers/post.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/upload.middleware.js";
const router = express.Router();

// public routes
router.get("/", getPosts);
router.get('/:postId', getSinglePost);
router.get('/user/:username', getUserPosts)

// protected routes
router.post('/', ProtectRoute, singleUpload, createPost);
router.get("/:postId/like", ProtectRoute,likePost);
router.delete("/:postId/delete", ProtectRoute, deletePost)

export default router;