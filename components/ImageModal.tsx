import React, { useState } from 'react';
import { Manifestation, ModelType } from '../types';

interface ImageModalProps {
  manifestation: Manifestation | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ manifestation, onClose, onDelete }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  if (!manifestation) return null;

  const handleDownload = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(manifestation.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vayu-${manifestation.id}.${manifestation.type === 'video' ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(manifestation.url, '_blank');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl transition-opacity animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-slate-900 rounded-3xl md:rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/70"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-0">
          {manifestation.type === 'video' ? (
            <video src={manifestation.url} className="w-full h-full object-contain" controls autoPlay loop playsInline />
          ) : (
            <img src={manifestation.url} alt={manifestation.prompt} className="w-full h-full object-contain" />
          )}
        </div>

        <div className="w-full md:w-80 lg:w-96 p-6 md:p-8 flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-white/5 overflow-y-auto custom-scrollbar">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div>
              <span className="block text-[8px] md:text-[10px] text-sky-400 font-black uppercase tracking-[0.4em] mb-3">Manifest Log</span>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-xs italic font-medium leading-relaxed">
                "{manifestation.prompt}"
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-[7px] text-slate-500 uppercase font-black tracking-widest mb-1">Type</span>
                <span className="text-[10px] text-white font-bold uppercase">{manifestation.type}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-[7px] text-slate-500 uppercase font-black tracking-widest mb-1">Engine</span>
                <span className="text-[10px] text-sky-400 font-black uppercase truncate block">{manifestation.model.replace('stable-diffusion-', 'SD-')}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <button 
              onClick={handleDownload}
              disabled={isSaving}
              className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-download"></i>}
              {isSaving ? 'Processing' : 'Save Locally'}
            </button>
            <button 
              onClick={() => { if(confirm("Erase from archive?")) { onDelete(manifestation.id); onClose(); } }} 
              className="w-full py-4 text-red-500/50 hover:text-red-400 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Delete Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;