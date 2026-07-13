import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';
import { generateTryOn as catvtonGenerate } from './catvtonService.js';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const backendRoot = path.join(__dirname, '..');
const frontendRoot = path.join(backendRoot, '..', 'frontend', 'public');

export const processTryOn = async (userImage, outfitImage) => {
  if (!userImage || !outfitImage) {
    const error = new Error('Both userImage and outfitImage are required.');
    error.status = 400;
    throw error;
  }

  // Resolve absolute paths
  let normalizedOutfit = outfitImage.replace(/^\/+/, '');
  if (normalizedOutfit.startsWith('public/')) {
    normalizedOutfit = normalizedOutfit.substring(7);
  }

  const userPhotoPath   = path.join(backendRoot, userImage.replace(/^\/+/, ''));
  const garmentPhotoPath = path.join(frontendRoot, normalizedOutfit);

  if (!fs.existsSync(userPhotoPath)) {
    const error = new Error(`User image not found at path: ${userPhotoPath}`);
    error.status = 404;
    throw error;
  }
  if (!fs.existsSync(garmentPhotoPath)) {
    const error = new Error(`Outfit image not found at path: ${garmentPhotoPath}`);
    error.status = 404;
    throw error;
  }

  // Determine gender dynamically from outfit path
  let gender = 'women';
  const lowerOutfit = outfitImage.toLowerCase();
  if (lowerOutfit.includes('/men/') || lowerOutfit.includes('/boys/')) {
    gender = 'men';
  } else if (lowerOutfit.includes('/kids/') || lowerOutfit.includes('/girls/')) {
    gender = 'kids';
  }

  try {
    // Attempt CatVTON
    const resultBuffer = await catvtonGenerate(userPhotoPath, garmentPhotoPath, gender);

    const filename   = `tryon-${uuid()}.jpg`;
    const resultPath = path.join(backendRoot, config.upload.dir, filename);
    fs.writeFileSync(resultPath, resultBuffer);

    return {
      status:         'ready',
      generatedImage: `/uploads/${filename}`,
      message:        'Try-On pipeline complete'
    };
  } catch (catvtonError) {
    // Identify whether CatVTON is simply unreachable
    const isNetworkError =
      catvtonError.code === 'ECONNREFUSED' ||
      catvtonError.code === 'ENOTFOUND'    ||
      catvtonError.code === 'ETIMEDOUT'    ||
      catvtonError.message?.toLowerCase().includes('connect') ||
      catvtonError.message?.toLowerCase().includes('timeout') ||
      !catvtonError.response;

    const errorMessage = catvtonError.response?.data?.message
      || catvtonError.message
      || 'CatVTON API failed.';

    if (isNetworkError) {
      // ── GRACEFUL FALLBACK ─────────────────────────────────────────────────
      // CatVTON is offline — copy the outfit image to uploads/ and return it
      // so the frontend flow works end-to-end for testing and demoing.
      console.warn('[processTryOn] CatVTON unavailable — using fallback:', errorMessage);

      const ext      = path.extname(garmentPhotoPath) || '.jpg';
      const filename = `tryon-fallback-${uuid()}${ext}`;
      const destPath = path.join(backendRoot, config.upload.dir, filename);
      fs.copyFileSync(garmentPhotoPath, destPath);

      return {
        status:         'fallback',
        generatedImage: `/uploads/${filename}`,
        message:        'CatVTON unavailable — showing outfit preview as fallback.'
      };
    }

    // CatVTON is reachable but returned an error — propagate the real message
    console.error('[processTryOn] CatVTON error:', errorMessage);
    const apiError = new Error(errorMessage);
    apiError.status = catvtonError.response?.status || 500;
    throw apiError;
  }
};
