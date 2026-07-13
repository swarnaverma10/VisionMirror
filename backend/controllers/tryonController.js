import * as tryOnService from '../services/tryOnService.js';

export const generateTryOn = async (req, res, next) => {
  try {
    const { userImage, outfitImage } = req.body;

    const result = await tryOnService.processTryOn(userImage, outfitImage);

    res.status(200).json({
      success: true,
      status: result.status,
      generatedImage: result.generatedImage,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
