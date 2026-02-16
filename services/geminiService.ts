
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

// Always initialize with named parameter and environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Flash to refine the user's prompt into a high-fidelity
 * creative instruction set for the Vayu generation modules.
 */
export const refineVisionPrompt = async (prompt: string, settings: GenerationSettings): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Vayu AGI Architect. Your goal is to transform user descriptions into master-level prompts for AI image/video synthesis.

User Vision: "${prompt}"
Context: ${settings.tool === 'image' ? 'Ultra-HD Still Imagery' : 'Cinematic High-Motion Video'}
Style Profile: "${settings.style}"
Ratio: "${settings.aspectRatio}"

Instructions:
1. Create a dense, visually-heavy prompt in English.
2. Incorporate specific technical keywords related to ${settings.style}: (e.g., lighting, lens type, atmosphere).
3. Max length: 60 words.
4. Output ONLY the refined prompt text. No quotes or intro.`,
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
      }
    });

    const result = response.text;
    return result ? result.trim() : prompt;
  } catch (error) {
    console.warn("[Architect Engine] Neural bypass engaged - using raw prompt.");
    return prompt;
  }
};
