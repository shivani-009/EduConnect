import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', createBooking);
router.get('/', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

export default router;
