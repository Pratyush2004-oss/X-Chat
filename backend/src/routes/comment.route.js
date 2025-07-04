import express from 'express';
import { createComment, deleteComment, getComments } from '../controllers/comment.controller.js';
import { ProtectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
// public route
router.get('/post/:postId', getComments);

// protected routes
router.post('/post/:postId', ProtectRoute, createComment);
router.delete('/:commentId', ProtectRoute, deleteComment);

export default router;