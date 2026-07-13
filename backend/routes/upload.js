import { Router } from 'express';
import { handleUpload } from '../controllers/uploadController.js';
import upload from '../middleware/upload.js';

const router = Router();

// POST /api/upload
router.post('/', upload.single('file'), handleUpload);

export default router;
