
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
      case ModelType.PUTER_GPT_IMAGE: return 'Vayu Core Alpha';
      case ModelType.PUTER_SDXL: return 'Vayu Neural Prime';
      case ModelType.PUTER_DALLE3: return 'Vayu Artistic Hub';
      case ModelType.PUTER_SD3: return 'Vayu Dream Engine';
      case ModelType.PUTER_COGVIDEO: return 'Vayu Cinematic Node';
      case ModelType.PUTER_KLING: return 'Vayu Motion Elite';
      case ModelType.PUTER_LUMA: return 'Vayu Reality Warp';
      case ModelType.PUTER_GEN2: return 'Vayu Kinetic Stream';
      default: return 'Vayu AGI Core';
    }
  };

  return (
    <div 
      className="group glass-card rounded-[2rem] overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      onClick={() => onClick(manifestation)}
      role="button"
      aria-label={`View manifestation: ${manifestation.prompt}`}
    >
      <div className="aspect-[4/5] relative bg-slate-900 overflow-hidden">
        {/* Skeleton Loader */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
             <i className="fa-solid fa-sparkles text-slate-700 text-3xl"></i>
          </div>
        )}

        {manifestation.type === 'video' ? (
          <video 
            src={manifestation.url} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            muted loop autoPlay playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        ) : (
          <img 
            src={manifestation.url} 
            alt={manifestation.prompt}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
        {/* Module Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="glass-blue px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${manifestation.type === 'video' ? 'bg-indigo-400' : 'bg-sky-400'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{getModuleName(manifestation.model)}</span>
          </div>
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-sky-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
            <i className="fa-solid fa-expand text-white"></i>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-300 line-clamp-2 font-medium italic group-hover:text-white transition-colors mb-4 leading-relaxed">
          "{manifestation.prompt}"
        </p>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${manifestation.type === 'video' ? 'fa-clapperboard' : 'fa-image'} text-sky-500/70 text-[10px]`}></i>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{manifestation.type}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-600 tracking-tighter">
            {new Date(manifestation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
