import express from 'express';
import { sendMessage, getConversation, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getConversations);
router.get('/:userId', getConversation);
router.post('/', sendMessage);

export default router;
