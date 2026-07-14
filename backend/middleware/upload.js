import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import config from '../config/index.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const backendRoot = path.join(__dirname, '..');
const uploadsDirResolved = path.resolve(backendRoot, config.upload.dir);

// ─── Storage Engine ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDirResolved);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${uuid()}${ext}`);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────────
function fileFilter(_req, file, cb) {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Unsupported file type: ${file.mimetype}. Allowed: ${config.upload.allowedTypes.join(', ')}`);
    error.status = 400; // Return 400 Bad Request
    cb(error, false);
  }
}

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSizeMb * 1024 * 1024 },
});

export default upload;
