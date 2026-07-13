import { Router } from 'express';
import { generateTryOn } from '../controllers/tryonController.js';

const router = Router();

// POST /api/tryon
router.post('/', generateTryOn);

export default router;
