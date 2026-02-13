
export type ContentType = 'image' | 'video';

export interface Manifestation {
  id: string;
  type: ContentType;
  url: string;
  prompt: string;
  timestamp: number;
  model: string;
  aspectRatio: string;
  style?: string;
}

export enum ModelType {
  // Imagery Identifiers
  PUTER_DALLE3 = 'dall-e-3',
  PUTER_SD3 = 'stable-diffusion-v3',
  PUTER_SDXL = 'stable-diffusion-xl',
  PUTER_GPT_IMAGE = 'dall-e-3', 
  
  // Cinema Identifiers
  PUTER_COGVIDEO = 'cogvideo',
  PUTER_KLING = 'kling',
  PUTER_LUMA = 'luma',
  PUTER_GEN2 = 'gen2'
}

export type StylePreset = 'Cinematic' | 'Cyberpunk' | 'Anime' | 'Photorealistic' | 'Digital Art' | 'Renaissance';

export interface GenerationSettings {
  model: ModelType;
  aspectRatio: '1:1' | '4:3' | '16:9' | '9:16';
  tool: 'image' | 'video';
  style: StylePreset;
}

export interface GenerationResult {
  url: string;
  actualType: ContentType;
}

declare global {
  interface Window {
    puter: any;
  }
}
