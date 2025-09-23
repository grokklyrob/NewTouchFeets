
import { GoogleGenAI, Modality } from "@google/genai";

// IMPORTANT FOR PRODUCTION: For security, it is highly recommended to move this key
// to an Environment Variable in your Vercel project settings.
// 1. In Vercel, create a variable named VITE_GEMINI_API_KEY with your key.
// 2. Then, change this line to: const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_KEY = "AIzaSyBCv1fMrk4M9Ll68LdlWbmR36mQZdouG0o";

if (!API_KEY) {
  throw new Error("API_KEY is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `Modify the uploaded image to add Jesus Christ, in a reverent and artistic Byzantine style, gently touching the subject’s bare feet. Maintain original background, perspective, and lighting. Ensure hands align anatomically with the feet, cast appropriate shadows, and preserve skin texture. Keep attire traditional with soft halo highlights. Do not change the subject’s identity or facial features. Avoid distortions, extra limbs, or blur. Final output at original resolution.`;

export interface EditImageResponse {
  imageB64: string | null;
  text: string | null;
}

export const editImage = async (base64ImageData: string, mimeType: string): Promise<EditImageResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: SYSTEM_PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageB64: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageB64 = part.inlineData.data;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    if (!imageB64) {
      throw new Error("API did not return an image. It might have been blocked.");
    }
    
    return { imageB64, text };

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
