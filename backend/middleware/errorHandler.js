import config from '../config/index.js';

/**
 * Global error handler middleware.
 */
export default function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.message);

  // Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File too large.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Unexpected file field.' });
  }

  const status = err.status || err.statusCode || 500;
  
  let message = err.message || 'Internal Server Error';

  res.status(status).json({ 
    success: false, 
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message,
    stack: err.stack
  });
}
