import express from 'express';
import { getTutors, getTutorById, updateMyTutorProfile } from '../controllers/tutorController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTutors);
router.put('/me', protect, requireRole('tutor'), updateMyTutorProfile);
router.get('/:id', getTutorById);

export default router;
