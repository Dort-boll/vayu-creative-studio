
import { ModelType, GenerationSettings, GenerationResult } from "../types";

const IMAGE_FALLBACKS = [ModelType.PUTER_DALLE3, ModelType.PUTER_SDXL, ModelType.PUTER_SD3];
const VIDEO_FALLBACKS = [ModelType.PUTER_COGVIDEO, ModelType.PUTER_KLING, ModelType.PUTER_LUMA];

const ensurePuterReady = async (): Promise<void> => {
    const start = Date.now();
    const timeout = 15000;
    while (!window.puter?.ai && (Date.now() - start) < timeout) {
        await new Promise(r => setTimeout(r, 500));
    }
    if (!window.puter?.ai) {
        throw new Error("Vayu Neural Link: Puter SDK failed to initialize. Check your internet connection.");
    }
};

/**
 * Uses Puter's internal AI Chat to refine the user's prompt
 * instead of relying on external Gemini API keys.
 */
const getRefinedPrompt = async (prompt: string, settings: GenerationSettings): Promise<string> => {
    try {
        await ensurePuterReady();
        
        const systemPrompt = `You are the Vayu AGI Architect. Refine this vision for ${settings.tool === 'image' ? 'still imagery' : 'cinematic motion'}.
        Vision: "${prompt}"
        Style: "${settings.style}"
        Requirements: High material physics, ${settings.style} aesthetics, 8k details. 
        Output ONLY the refined prompt (max 60 words). No preamble.`;

        const response = await window.puter.ai.chat(systemPrompt);
        
        // Puter AI Chat returns a string directly or an object with a message
        const refinedText = typeof response === 'string' ? response : response?.message?.content;
        
        return refinedText || prompt;
    } catch (e: any) {
        console.warn("[Vayu Architect] Refinement failed, using original prompt.", e);
        return prompt;
    }
};

export const generateManifestation = async (
    prompt: string,
    settings: GenerationSettings
): Promise<GenerationResult> => {
    try {
        await ensurePuterReady();
        
        // Architect the prompt using Puter's built-in AI
        const refinedPrompt = await getRefinedPrompt(prompt, settings);
        
        if (settings.tool === 'image') {
            const models = [settings.model, ...IMAGE_FALLBACKS.filter(m => m !== settings.model)];
            for (const model of models) {
                try {
                    const res = await Promise.race([
                        window.puter.ai.txt2img(refinedPrompt, { model }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 45000))
                    ]);
                    if (res?.src) return { url: res.src, actualType: 'image' };
                } catch (err) {
                    console.warn(`[Vayu Engine] Node ${model} failure. Cycling...`);
                }
            }
        } else {
            const models = [settings.model, ...VIDEO_FALLBACKS.filter(m => m !== settings.model)];
            for (const model of models) {
                try {
                    const res = await Promise.race([
                        window.puter.ai.txt2vid(refinedPrompt, { model }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 120000))
                    ]);
                    
                    const url = res?.src || res?.url || (typeof res === 'string' ? res : null);
                    if (url && typeof url === 'string' && url.startsWith('http')) {
                        return { url, actualType: 'video' };
                    }
                } catch (err) {
                    console.warn(`[Vayu Engine] Cinema node ${model} failure. Cycling...`);
                }
            }
            
            // Image Fallback for Video failure
            const fallback = await window.puter.ai.txt2img(refinedPrompt, { model: ModelType.PUTER_SDXL });
            if (fallback?.src) return { url: fallback.src, actualType: 'image' };
        }
    } catch (globalErr: any) {
        throw new Error(globalErr.message || "Synthesis disrupted: Atmospheric noise detected in neural link.");
    }

    throw new Error("Vayu Link Failure: All neural nodes are currently unreachable. Please try a different module.");
};
