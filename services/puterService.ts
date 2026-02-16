import { ModelType, GenerationSettings, GenerationResult } from "../types";
import { refineVisionPrompt } from "./geminiService";

const IMAGE_FALLBACKS = [ModelType.PUTER_DALLE3, ModelType.PUTER_SDXL, ModelType.PUTER_SD3];
const VIDEO_FALLBACKS = [ModelType.PUTER_COGVIDEO, ModelType.PUTER_KLING, ModelType.PUTER_LUMA];

let puterInitPromise: Promise<void> | null = null;

const ensurePuterReady = async (): Promise<void> => {
    if (!puterInitPromise) {
        puterInitPromise = new Promise(async (resolve, reject) => {
            const start = Date.now();
            const timeout = 35000; 
            const check = async () => {
                // Check if script is blocked by Zero Trust / Adblock
                if (window.puter && window.puter.ai) {
                    console.log("[Vayu Engine] Neural nodes synchronized.");
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error("Neural Link Failure: Puter framework blocked. If you are using Cloudflare Zero Trust or a VPN, ensure 'js.puter.com' is allowed."));
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    }
    return puterInitPromise;
};

const executeSynthesis = async (prompt: string, model: string, type: 'image' | 'video'): Promise<string | null> => {
    try {
        const timeoutMs = type === 'image' ? 95000 : 250000; 
        const res = await Promise.race([
            type === 'image' 
                ? window.puter.ai.txt2img(prompt, { model }) 
                : window.puter.ai.txt2vid(prompt, { model }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Node Timeout")), timeoutMs))
        ]) as any;

        const url = res?.src || res?.url || (typeof res === 'string' ? res : null);
        if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:'))) {
            return url;
        }
        return null;
    } catch (err: any) {
        // Log detailed error for debugging Cloudflare issues
        console.warn(`[Vayu Engine] Node ${model} rejected synthesis:`, err?.message || err);
        return null;
    }
};

export const generateManifestation = async (
    prompt: string,
    settings: GenerationSettings
): Promise<GenerationResult> => {
    try {
        await ensurePuterReady();
        
        // Phase 1: Architect Mode (High-Fidelity)
        const refinedPrompt = await refineVisionPrompt(prompt, settings);
        const models = settings.tool === 'image' 
            ? [settings.model, ...IMAGE_FALLBACKS.filter(m => m !== settings.model)]
            : [settings.model, ...VIDEO_FALLBACKS.filter(m => m !== settings.model)];

        console.log("[Vayu AGI] Phase 1: Attempting synthesis with Refined Architect prompt.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(refinedPrompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

        // Phase 2: Direct Manifest Mode (Safety/Link Fallback)
        // If the refined prompt is too complex for current neural nodes, use the raw user input.
        console.log("[Vayu AGI] Phase 2: Architect rejected. Attempting with Direct Vision input.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(prompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

    } catch (globalErr: any) {
        console.error("[Vayu Engine] Global Synthesis Error:", globalErr);
        throw new Error(globalErr.message || "Synthesis disrupted: Core neural handshake failed.");
    }

    throw new Error("Vayu Link Exhausted: All neural nodes are currently congested. This can happen under high traffic or if your Cloudflare Zero Trust session has expired. Try again in a few moments.");
};