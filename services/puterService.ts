import { ModelType, GenerationSettings, GenerationResult } from "../types";
import { refineVisionPrompt } from "./geminiService";

const IMAGE_FALLBACKS = [ModelType.PUTER_DALLE3, ModelType.PUTER_SDXL, ModelType.PUTER_SD3];
const VIDEO_FALLBACKS = [ModelType.PUTER_COGVIDEO, ModelType.PUTER_KLING, ModelType.PUTER_LUMA];

// Singleton promise to ensure Puter is only initialized once
let puterInitPromise: Promise<void> | null = null;

const ensurePuterReady = async (): Promise<void> => {
    if (!puterInitPromise) {
        puterInitPromise = new Promise(async (resolve, reject) => {
            const start = Date.now();
            const timeout = 25000; 
            const check = async () => {
                if (window.puter && window.puter.ai) {
                    console.log("[Vayu Engine] Puter Framework synchronized.");
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error("Neural Link Failure: Puter framework failed to stabilize. Check your internet connection."));
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    }
    return puterInitPromise;
};

/**
 * Executes the actual Puter AI call with a timeout
 */
const executeSynthesis = async (prompt: string, model: string, type: 'image' | 'video'): Promise<string | null> => {
    try {
        const timeoutMs = type === 'image' ? 70000 : 190000;
        const res = await Promise.race([
            type === 'image' 
                ? window.puter.ai.txt2img(prompt, { model }) 
                : window.puter.ai.txt2vid(prompt, { model }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs))
        ]) as any;

        const url = res?.src || res?.url || (typeof res === 'string' ? res : null);
        if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:'))) {
            return url;
        }
        return null;
    } catch (err) {
        console.warn(`[Vayu Engine] Node ${model} failed:`, err);
        return null;
    }
};

export const generateManifestation = async (
    prompt: string,
    settings: GenerationSettings
): Promise<GenerationResult> => {
    try {
        await ensurePuterReady();
        
        // Phase 1: Architect the prompt using Gemini's reasoning
        const refinedPrompt = await refineVisionPrompt(prompt, settings);
        const models = settings.tool === 'image' 
            ? [settings.model, ...IMAGE_FALLBACKS.filter(m => m !== settings.model)]
            : [settings.model, ...VIDEO_FALLBACKS.filter(m => m !== settings.model)];

        console.log("[Vayu AGI] Phase 1: Attempting synthesis with Refined Architect prompt.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(refinedPrompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

        // Phase 2: Fallback to Raw prompt (sometimes simpler is better for Puter filters)
        console.log("[Vayu AGI] Phase 2: Refined prompt rejected. Falling back to Raw Vision input.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(prompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

    } catch (globalErr: any) {
        console.error("[Vayu Engine] Global Synthesis Error:", globalErr);
        throw new Error(globalErr.message || "Synthesis disrupted: Core neural handshake failed.");
    }

    throw new Error("Vayu Link Exhausted: No available neural nodes could manifest this vision. Tip: If this persists, try signing in to your Puter.com account in another tab to refresh your AI quota.");
};