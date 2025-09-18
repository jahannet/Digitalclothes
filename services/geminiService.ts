
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function virtualTryOn(modelImage: UploadedImage, clothingImage: UploadedImage): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: modelImage.base64,
              mimeType: modelImage.mimeType,
            },
          },
          {
            inlineData: {
              data: clothingImage.base64,
              mimeType: clothingImage.mimeType,
            },
          },
          {
            text: `Using the person in the first image as the model and the clothing item from the second image, generate a new image where the person is realistically wearing that clothing. The background should be clean and simple, matching the original model's photo. The final output must only be the generated image of the person wearing the clothes.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("AI did not return an image. Please try again with different images.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process images with AI. Please check the console for details.");
  }
}
