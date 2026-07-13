import { Router } from 'express';
import { generateStyling } from '../controllers/stylistController.js';

const router = Router();

// POST /api/stylist
router.post('/', generateStyling);

export default router;
