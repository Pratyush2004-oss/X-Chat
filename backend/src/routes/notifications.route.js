import express from 'express'
import { ProtectRoute } from '../middleware/auth.middleware.js';
import { deleteNotification, getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

// private routes
router.get('/', ProtectRoute, getNotifications)
router.delete('/:notificationId', ProtectRoute, deleteNotification)

export default router;