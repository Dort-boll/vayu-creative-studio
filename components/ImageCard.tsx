import React, { useState } from 'react';
import { Manifestation, ModelType } from '../types';

interface ImageCardProps {
  manifestation: Manifestation;
  onClick: (m: Manifestation) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ manifestation, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getModuleName = (id: string) => {
    switch (id) {
      case ModelType.PUTER_GPT_IMAGE: return 'Core Alpha';
      case ModelType.PUTER_SDXL: return 'Neural Prime';
      case ModelType.PUTER_DALLE3: return 'Artistic Hub';
      case ModelType.PUTER_SD3: return 'Dream Engine';
      case ModelType.PUTER_COGVIDEO: return 'Cinema Node';
      case ModelType.PUTER_KLING: return 'Motion Elite';
      case ModelType.PUTER_LUMA: return 'Reality Warp';
      case ModelType.PUTER_GEN2: return 'Kinetic Stream';
      default: return 'AGI Core';
    }
  };

  return (
    <div 
      className="group neo-card rounded-[2.5rem] overflow-hidden cursor-pointer active:scale-[0.98] flex flex-col h-full"
      onClick={() => onClick(manifestation)}
      role="button"
      aria-label={`View manifestation: ${manifestation.prompt}`}
    >
      <div className="aspect-[4/5] relative bg-slate-950 overflow-hidden">
        {/* Skeleton Loader */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
             <i className="fa-solid fa-sparkles text-slate-800 text-3xl animate-pulse"></i>
          </div>
        )}

        {manifestation.type === 'video' ? (
          <video 
            src={manifestation.url} 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            muted loop autoPlay playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        ) : (
          <img 
            src={manifestation.url} 
            alt={manifestation.prompt}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
        {/* Module Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="glass-blue px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 backdrop-blur-lg">
            <div className={`w-1.5 h-1.5 rounded-full ${manifestation.type === 'video' ? 'bg-indigo-400' : 'bg-sky-400'}`}></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/80">{getModuleName(manifestation.model)}</span>
          </div>
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[4px]">
          <div className="w-12 h-12 rounded-2xl glass-blue border border-white/20 flex items-center justify-center shadow-2xl">
            <i className="fa-solid fa-expand text-white text-sm"></i>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-slate-400 line-clamp-2 font-medium italic group-hover:text-white transition-colors mb-6 leading-relaxed flex-1">
          "{manifestation.prompt}"
        </p>
        <div className="flex items-center justify-between border-t border-white/5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-6 h-6 rounded-lg glass-panel flex items-center justify-center border border-white/5`}>
                <i className={`fa-solid ${manifestation.type === 'video' ? 'fa-clapperboard text-indigo-400' : 'fa-image text-sky-400'} text-[9px]`}></i>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{manifestation.type}</span>
          </div>
          <span className="text-[8px] font-bold text-slate-600 tracking-widest uppercase">
            {new Date(manifestation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;