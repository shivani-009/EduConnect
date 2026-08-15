import express from 'express';
import { getNotifications, markRead, deleteNotification, clearAll } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);
router.delete('/', clearAll);

export default router;
