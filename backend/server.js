import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import config from './config/index.js';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

// ─── ESM __dirname shim ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Ensure uploads directory exists ──────────────────────────────────────────
const uploadsDir = path.join(__dirname, config.upload.dir);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Express app ──────────────────────────────────────────────────────────────
const app = express();

// ── Security & Production Middlewares ─────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false, // allow loading local images if needed
}));
app.use(compression());

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API Timeout Handling Middleware
app.use('/api', (req, res, next) => {
  req.setTimeout(300000); // 300 seconds (5 min) — CatVTON inference can exceed 60-120s
  res.setTimeout(300000);
  next();
});

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// ── Request logging ───────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static file serving (uploaded images) ────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── Health check route for root path ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: "ok",
    service: "VisionMirror Backend"
  });
});

// ── 404 handler for unmatched routes ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log(`\n🪞  VisionMirror API`);
  console.log(`   ✅  Running  →  http://localhost:${config.port}`);
  console.log(`   📁  Uploads  →  ${uploadsDir}`);
  console.log(`   🌍  Env      →  ${config.nodeEnv}\n`);
});

// Ensure global server timeout accommodates long AI tasks
server.setTimeout(310000); 

export default app;