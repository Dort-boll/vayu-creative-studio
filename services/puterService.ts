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
            const timeout = 30000; // Increased to 30s for better stability on Cloudflare
            const check = async () => {
                if (window.puter && window.puter.ai) {
                    console.log("[Vayu Engine] Puter Framework stabilized.");
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error("Neural Link Failure: Puter framework failed to stabilize. Check your network or disable adblockers."));
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
 * Executes a single synthesis attempt with explicit timeout management
 */
const executeSynthesis = async (prompt: string, model: string, type: 'image' | 'video'): Promise<string | null> => {
    try {
        // Generous timeouts for cloud generation
        const timeoutMs = type === 'image' ? 90000 : 240000; 
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
    } catch (err) {
        console.warn(`[Vayu Engine] Synthesis failed on node ${model}:`, err);
        return null;
    }
};

export const generateManifestation = async (
    prompt: string,
    settings: GenerationSettings
): Promise<GenerationResult> => {
    try {
        await ensurePuterReady();
        
        // Phase 1: Try Architect (Refined) Prompt across all fallback models
        const refinedPrompt = await refineVisionPrompt(prompt, settings);
        const models = settings.tool === 'image' 
            ? [settings.model, ...IMAGE_FALLBACKS.filter(m => m !== settings.model)]
            : [settings.model, ...VIDEO_FALLBACKS.filter(m => m !== settings.model)];

        console.log("[Vayu AGI] Phase 1: Attempting synthesis with Architect prompt.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(refinedPrompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

        // Phase 2: If Phase 1 fails (exhaustion or safety filters), try Raw prompt
        // Sometimes Gemini's refined prompts hit safety filters that the original input doesn't.
        console.log("[Vayu AGI] Phase 2: Architect rejected. Attempting with Raw Vision input.");
        for (const modelId of models) {
            const resultUrl = await executeSynthesis(prompt, modelId, settings.tool);
            if (resultUrl) return { url: resultUrl, actualType: settings.tool };
        }

    } catch (globalErr: any) {
        console.error("[Vayu Engine] Global Handshake Error:", globalErr);
        throw new Error(globalErr.message || "Synthesis disrupted: Neural handshake failed.");
    }

    throw new Error("Vayu Link Exhausted: No available neural nodes could manifest this vision at this time. Tip: Open Puter.com in a new tab to ensure your session is active.");
};