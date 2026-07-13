import * as stylistService from '../services/stylistService.js';

export const generateStyling = async (req, res, next) => {
  try {
    const result = await stylistService.processStyling(req.body);

    res.status(200).json({
      success: true,
      summary: result.summary,
      tips: result.tips,
      occasion: result.occasion,
      fabric: result.fabric,
      color: result.color
    });
  } catch (error) {
    next(error);
  }
};
