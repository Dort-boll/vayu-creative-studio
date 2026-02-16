import React, { useState } from 'react';
import { ModelType, GenerationSettings, StylePreset } from '../types';

interface ImageGeneratorProps {
  onGenerate: (prompt: string, settings: GenerationSettings) => Promise<void>;
  isGenerating: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    model: ModelType.PUTER_DALLE3,
    aspectRatio: '1:1',
    tool: 'image',
    style: 'Cinematic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt, settings);
  };

  const imageModels = [
    { id: ModelType.PUTER_DALLE3, name: 'Vayu Alpha', icon: 'fa-brain', color: 'bg-emerald-500/10 text-emerald-400' },
    { id: ModelType.PUTER_SDXL, name: 'Neural Prime', icon: 'fa-sparkles', color: 'bg-indigo-500/10 text-indigo-400' },
    { id: ModelType.PUTER_SD3, name: 'Dream Engine', icon: 'fa-cloud', color: 'bg-sky-500/10 text-sky-400' },
  ];

  const videoModels = [
    { id: ModelType.PUTER_COGVIDEO, name: 'Cinema Hub', icon: 'fa-film', color: 'bg-rose-500/10 text-rose-400' },
    { id: ModelType.PUTER_KLING, name: 'Motion Pro', icon: 'fa-clapperboard', color: 'bg-violet-500/10 text-violet-400' },
    { id: ModelType.PUTER_LUMA, name: 'Reality Warp', icon: 'fa-vr-cardboard', color: 'bg-blue-500/10 text-blue-400' },
  ];

  const styles: StylePreset[] = ['Cinematic', 'Cyberpunk', 'Anime', 'Photorealistic', 'Digital Art', 'Renaissance'];
  const currentModels = settings.tool === 'image' ? imageModels : videoModels;

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 mb-16 md:mb-32 relative z-10">
      {/* Responsive Tabs */}
      <div className="flex justify-center mb-6 md:mb-10">
        <div className="glass-blue p-1.5 rounded-2xl md:rounded-[2rem] flex gap-1.5 border border-white/5 shadow-xl relative">
          <button 
            type="button"
            onClick={() => setSettings(s => ({ ...s, tool: 'image', model: ModelType.PUTER_DALLE3 }))}
            className={`px-6 md:px-10 py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${settings.tool === 'image' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <i className="fa-solid fa-image"></i> Imagery
          </button>
          <button 
            type="button"
            onClick={() => setSettings(s => ({ ...s, tool: 'video', model: ModelType.PUTER_COGVIDEO }))}
            className={`px-6 md:px-10 py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${settings.tool === 'video' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <i className="fa-solid fa-video"></i> Cinema
          </button>
        </div>
      </div>

      <div className={`glass-blue rounded-3xl md:rounded-[4rem] p-5 md:p-12 relative overflow-hidden transition-all duration-700 ${isGenerating ? 'border-sky-400/40 ring-4 ring-sky-400/5' : 'border-white/5'}`}>
        {isGenerating && <div className="scanner-line"></div>}
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Primary Input */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[9px] md:text-[10px] font-black text-sky-400/80 uppercase tracking-[0.4em] ml-2">Vision Input</label>
                <textarea
                  value={prompt}
                  disabled={isGenerating}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={settings.tool === 'image' ? "Envision something extraordinary..." : "Choreograph a scene in motion..."}
                  className="w-full h-40 md:h-64 bg-slate-950/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white placeholder:text-slate-700 focus:outline-none focus:border-sky-400/30 transition-all resize-none text-sm md:text-lg font-medium leading-relaxed custom-scrollbar"
                />
              </div>

              {/* Adaptive Styles */}
              <div className="flex flex-col gap-3">
                <label className="text-[9px] md:text-[10px] font-black text-sky-400/80 uppercase tracking-[0.4em] ml-2">Artistic Filter</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, style }))}
                      className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${settings.style === style ? 'bg-sky-500/10 border-sky-400/40 text-sky-300' : 'bg-white/5 border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary Config */}
            <div className="lg:col-span-4 flex flex-col gap-8 lg:justify-between">
              <div className="flex flex-col gap-4">
                <label className="text-[9px] md:text-[10px] font-black text-sky-400/80 uppercase tracking-[0.4em] ml-2">Neural Node</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {currentModels.map(model => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, model: model.id as ModelType }))}
                      className={`w-full p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${settings.model === model.id ? 'bg-white/5 border-sky-400/30 shadow-xl' : 'bg-transparent border-transparent opacity-50 hover:opacity-100 hover:bg-white/5'}`}
                    >
                      <div className={`w-10 h-10 flex-shrink-0 rounded-xl ${model.color} flex items-center justify-center text-base`}>
                        <i className={`fa-solid ${model.icon}`}></i>
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white truncate">{model.name}</h4>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Verified Link</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                   {(['1:1', '16:9'] as const).map(ratio => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio }))}
                        className={`py-3 rounded-xl text-[9px] font-black border transition-all ${settings.aspectRatio === ratio ? 'bg-sky-500/10 border-sky-400/30 text-sky-300' : 'bg-white/5 border-transparent text-slate-500'}`}
                      >
                        {ratio}
                      </button>
                   ))}
                </div>
                
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-6 md:py-10 rounded-2xl md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.5em] transition-all manifest-btn text-white disabled:opacity-20 shadow-2xl relative overflow-hidden`}
                >
                  <span className="relative z-10">{isGenerating ? 'Synthesizing...' : 'Manifest'}</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageGenerator;