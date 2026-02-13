
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
    { id: ModelType.PUTER_DALLE3, name: 'Vayu Alpha', icon: 'fa-brain', color: 'bg-emerald-600' },
    { id: ModelType.PUTER_SDXL, name: 'Neural Prime', icon: 'fa-sparkles', color: 'bg-indigo-600' },
    { id: ModelType.PUTER_SD3, name: 'Dream Engine', icon: 'fa-cloud', color: 'bg-sky-600' },
  ];

  const videoModels = [
    { id: ModelType.PUTER_COGVIDEO, name: 'Cinema Hub', icon: 'fa-film', color: 'bg-rose-600' },
    { id: ModelType.PUTER_KLING, name: 'Motion Pro', icon: 'fa-clapperboard', color: 'bg-violet-600' },
    { id: ModelType.PUTER_LUMA, name: 'Reality Warp', icon: 'fa-vr-cardboard', color: 'bg-blue-600' },
  ];

  const styles: StylePreset[] = ['Cinematic', 'Cyberpunk', 'Anime', 'Photorealistic', 'Digital Art', 'Renaissance'];
  const currentModels = settings.tool === 'image' ? imageModels : videoModels;

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 mb-12 md:mb-24 relative z-10">
      {/* Tool Selection */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="glass-blue p-1.5 rounded-full flex gap-1 md:gap-3 border border-white/5 shadow-2xl">
          <button 
            type="button"
            onClick={() => setSettings(s => ({ ...s, tool: 'image', model: ModelType.PUTER_DALLE3 }))}
            className={`px-4 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all flex items-center gap-2 ${settings.tool === 'image' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <i className="fa-solid fa-image"></i> Imagery
          </button>
          <button 
            type="button"
            onClick={() => setSettings(s => ({ ...s, tool: 'video', model: ModelType.PUTER_COGVIDEO }))}
            className={`px-4 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all flex items-center gap-2 ${settings.tool === 'video' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <i className="fa-solid fa-video"></i> Cinema
          </button>
        </div>
      </div>

      <div className={`glass-card rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 relative overflow-hidden transition-all duration-700 ${isGenerating ? 'border-sky-400/40 ring-1 ring-sky-400/20 shadow-[0_0_100px_rgba(56,189,248,0.1)]' : 'border-white/5'}`}>
        {isGenerating && <div className="scanner-line"></div>}
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            
            {/* Input Side */}
            <div className="lg:col-span-8 space-y-8 md:space-y-10">
              <div>
                <label className="flex items-center gap-3 text-[10px] font-black text-sky-400 uppercase tracking-[0.5em] mb-4 md:mb-6">
                  Vision Transcription
                </label>
                <textarea
                  value={prompt}
                  disabled={isGenerating}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={settings.tool === 'image' ? "Describe the impossible..." : "Set the scene in motion..."}
                  className="w-full h-32 md:h-64 bg-slate-950/50 border border-white/10 rounded-3xl p-6 md:p-10 text-white placeholder:text-slate-700 focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all resize-none text-base md:text-xl font-light leading-relaxed custom-scrollbar"
                />
              </div>

              {/* Style Presets */}
              <div>
                <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.5em] mb-4 md:mb-6 block">Artistic Resonance</label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {styles.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, style }))}
                      className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${settings.style === style ? 'bg-sky-500 text-white border-sky-400 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.5em] mb-4 block">Geometry</label>
                  <div className="flex gap-2">
                    {(['1:1', '4:3', '16:9', '9:16'] as const).map(ratio => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio }))}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black border transition-all ${settings.aspectRatio === ratio ? 'bg-white/10 border-sky-400/50 text-sky-400 shadow-inner' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col justify-end">
                    <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-loose">
                       <i className="fa-solid fa-circle-check text-sky-400 mr-2"></i> All modules status: operational.<br/>
                       <i className="fa-solid fa-bolt text-indigo-400 mr-2"></i> Neural link: stable at 4.2ms.
                    </div>
                </div>
              </div>
            </div>

            {/* Config Side */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-8 lg:space-y-0">
              <div className="space-y-6">
                <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.5em] mb-2 block">Neural Module</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {currentModels.map(model => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, model: model.id as ModelType }))}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${settings.model === model.id ? 'bg-white/10 border-sky-400/50 shadow-2xl' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.08]'}`}
                    >
                      <div className={`w-12 h-12 flex-shrink-0 rounded-xl ${model.color} flex items-center justify-center text-white text-xl shadow-lg shadow-black/20`}>
                        <i className={`fa-solid ${model.icon}`}></i>
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className={`text-[10px] font-black uppercase tracking-widest truncate ${settings.model === model.id ? 'text-sky-400' : 'text-slate-400'}`}>{model.name}</h4>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter mt-1">Ready for synthesis</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-6 md:py-10 rounded-3xl font-black text-[11px] md:text-sm uppercase tracking-[0.6em] transition-all manifest-btn text-white relative group overflow-hidden ${isGenerating || !prompt.trim() ? 'opacity-40 grayscale' : 'hover:scale-[1.02] active:scale-95'}`}
                >
                  <span className="relative z-10">{isGenerating ? 'Resonating...' : 'Manifest'}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
                <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-widest mt-6">
                  Vayu AGI v2.5 • Secured Neural Handshake
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageGenerator;
