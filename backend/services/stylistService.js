import axios from 'axios';
import config from '../config/index.js';

export const processStyling = async (outfitData) => {
  const { category, outfitName, color, fabric, occasion, style } = outfitData;

  // Validate all required inputs
  const requiredFields = ['category', 'outfitName', 'color', 'fabric', 'occasion', 'style'];
  for (const field of requiredFields) {
    if (!outfitData[field]) {
      const error = new Error(`Missing required field: ${field}`);
      error.status = 400;
      throw error;
    }
  }

  const systemPrompt = `You are a professional fashion stylist AI for VisionMirror. 
Your task is to provide a brief outfit summary and 3-4 specific styling tips based on the outfit details provided.
Return your response ONLY as a JSON object matching this exact structure:
{
  "summary": "2-3 sentences describing the outfit style and vibe.",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  const userPrompt = `Analyze this outfit:
- Category: ${category}
- Name: ${outfitName}
- Color: ${color}
- Fabric: ${fabric}
- Occasion: ${occasion}
- Style: ${style}`;

  try {
    const response = await axios.post(
      `${config.openrouter.baseUrl}/chat/completions`,
      {
        model: config.openrouter.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${config.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://visionmirror.app',
          'X-Title': 'VisionMirror'
        },
        timeout: 20000 // 20s timeout
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || `The ${outfitName} is a beautiful ${color} ${category}.`,
      tips: parsed.tips || [`Pair this ${color} piece with matching accessories.`],
      occasion,
      fabric,
      color
    };
  } catch (error) {
    console.error('[processStyling] Error:', error.response?.data || error.message);
    const apiError = new Error('Failed to generate styling recommendations.');
    apiError.status = 500;
    throw apiError;
  }
};
