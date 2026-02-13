
import { GoogleGenAI } from "@google/genai";
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
        throw new Error("Vayu Neural Link: Link establishment timed out. High network noise detected.");
    }
};

const getRefinedPrompt = async (prompt: string, settings: GenerationSettings): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return prompt;

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `As Vayu Architect, refine this vision for ${settings.tool === 'image' ? 'still imagery' : 'cinematic motion'}.
            Current Vision: "${prompt}"
            Style Resonance: "${settings.style}"
            Requirements: Vivid material physics, ${settings.style} lighting aesthetics, 8k resolution details. Max 65 words.`,
            config: {
                systemInstruction: "You are the Vayu AGI Architect, a master of converting abstract concepts into hyper-detailed neural synthesis scripts."
            }
        });

        return response.text || prompt;
    } catch (e: any) {
        return prompt;
    }
};

export const generateManifestation = async (
    prompt: string,
    settings: GenerationSettings
): Promise<GenerationResult> => {
    try {
        await ensurePuterReady();
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
                    console.warn(`[Vayu Engine] Core ${model} node failure. Cycling...`);
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
                    console.warn(`[Vayu Engine] Cinema core ${model} node failure. Cycling...`);
                }
            }
            
            // Image Fallback for Video failure
            const fallback = await window.puter.ai.txt2img(refinedPrompt, { model: ModelType.PUTER_SDXL });
            if (fallback?.src) return { url: fallback.src, actualType: 'image' };
        }
    } catch (globalErr: any) {
        throw new Error(globalErr.message || "Synthesis disrupted: Atmospheric noise detected in neural link.");
    }

    throw new Error("Vayu Link Failure: All neural nodes are currently unreachable. Retrying at lower fidelity is recommended.");
};
