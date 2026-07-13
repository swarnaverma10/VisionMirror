import * as uploadService from '../services/uploadService.js';

export const handleUpload = (req, res, next) => {
  try {
    const result = uploadService.processUpload(req.file);
    
    res.status(200).json({
      success: true,
      imageUrl: result.imageUrl,
      filename: result.filename
    });
  } catch (err) {
    next(err);
  }
};
