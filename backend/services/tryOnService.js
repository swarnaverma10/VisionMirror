import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';
import axios from 'axios';
import os from 'os';
import { generateTryOn as catvtonGenerate } from './catvtonService.js';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const backendRoot = path.join(__dirname, '..');
export const processTryOn = async (userImage, outfitImage) => {
  console.log('[processTryOn] START — userImage:', userImage, '| outfitImage:', outfitImage);
  if (!userImage || !outfitImage) {
    const error = new Error('Both userImage and outfitImage are required.');
    error.status = 400;
    throw error;
  }

  // 1. Verify user image exists locally or download if relative/remote
  let userPhotoPath = path.join(backendRoot, userImage.replace(/^\/+/, ''));
  let tempUserPath = null;

  if (!fs.existsSync(userPhotoPath)) {
    let userUrl = userImage;
    if (!userImage.startsWith('http://') && !userImage.startsWith('https://')) {
      const baseUrl = config.corsOrigins[0] || 'http://localhost:5173';
      let normalizedUser = userImage.replace(/^\/+/, '');
      if (normalizedUser.startsWith('public/')) {
        normalizedUser = normalizedUser.substring(7);
      }
      userUrl = `${baseUrl.replace(/\/$/, '')}/${normalizedUser}`;
    }

    const userExt = path.extname(userImage.split('?')[0]) || '.jpg';
    tempUserPath = path.join(os.tmpdir(), `user-${uuid()}${userExt}`);

    try {
      const response = await axios.get(userUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(tempUserPath, response.data);
      userPhotoPath = tempUserPath;
      console.log('[processTryOn] Downloaded user image to:', tempUserPath, '| size:', response.data.length);
    } catch (downloadError) {
      const error = new Error(`Failed to download user image from: ${userUrl}. Error: ${downloadError.message}`);
      error.status = 404;
      throw error;
    }
  } else {
    console.log('[processTryOn] User image found locally:', userPhotoPath);
  }

  // 2. Resolve outfit image URL
  let outfitUrl = outfitImage;
  if (!outfitImage.startsWith('http://') && !outfitImage.startsWith('https://')) {
    const baseUrl = config.corsOrigins[0] || 'http://localhost:5173';
    let normalizedOutfit = outfitImage.replace(/^\/+/, '');
    if (normalizedOutfit.startsWith('public/')) {
      normalizedOutfit = normalizedOutfit.substring(7);
    }
    outfitUrl = `${baseUrl.replace(/\/$/, '')}/${normalizedOutfit}`;
  }

  // 3. Download outfit image to a temp file
  const ext = path.extname(outfitImage.split('?')[0]) || '.jpg';
  const tempGarmentPath = path.join(os.tmpdir(), `garment-${uuid()}${ext}`);

  try {
    const response = await axios.get(outfitUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(tempGarmentPath, response.data);
    console.log('[processTryOn] Downloaded outfit image to:', tempGarmentPath, '| size:', response.data.length);
  } catch (downloadError) {
    const error = new Error(`Failed to download outfit image from: ${outfitUrl}. Error: ${downloadError.message}`);
    error.status = 400;
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
    console.log('[processTryOn] Calling CatVTON with:', { userPhotoPath, tempGarmentPath, gender });
    const resultBuffer = await catvtonGenerate(userPhotoPath, tempGarmentPath, gender);
    console.log('[processTryOn] CatVTON returned buffer, size:', resultBuffer.length);

    const filename   = `tryon-${uuid()}.jpg`;
    const resultPath = path.join(backendRoot, config.upload.dir, filename);
    fs.writeFileSync(resultPath, resultBuffer);

    return {
      status:         'ready',
      generatedImage: `/uploads/${filename}`,
      message:        'Try-On pipeline complete'
    };
  } catch (catvtonError) {
    const errorMessage = catvtonError.response?.data?.message
      || catvtonError.message
      || 'CatVTON API failed.';

    console.error('[processTryOn] CatVTON error:', {
      code: catvtonError.code,
      message: catvtonError.message,
      hasResponse: !!catvtonError.response,
      status: catvtonError.response?.status
    });

    const apiError = new Error(errorMessage);
    apiError.status = catvtonError.response?.status || 500;
    throw apiError;
  } finally {
    // Cleanup temporary files
    try {
      if (tempUserPath && fs.existsSync(tempUserPath)) {
        fs.unlinkSync(tempUserPath);
      }
    } catch (cleanupError) {
      console.error('[processTryOn] User temporary file cleanup error:', cleanupError.message);
    }
    try {
      if (fs.existsSync(tempGarmentPath)) {
        fs.unlinkSync(tempGarmentPath);
      }
    } catch (cleanupError) {
      console.error('[processTryOn] Garment temporary file cleanup error:', cleanupError.message);
    }
  }
};
