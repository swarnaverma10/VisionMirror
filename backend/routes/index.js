import { Router }        from 'express';
import uploadRoutes      from './upload.js';
import tryonRoutes       from './tryon.js';
import stylistRoutes     from './stylist.js';

const router = Router();

router.use('/upload',  uploadRoutes);
router.use('/tryon',   tryonRoutes);
router.use('/stylist', stylistRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: "VisionMirror Backend Running"
  });
});

export default router;
