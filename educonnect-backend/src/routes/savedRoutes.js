import express from 'express';
import { toggleSaved, getSaved } from '../controllers/savedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getSaved);
router.post('/toggle', toggleSaved);

export default router;
