
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
      console.error("Download failed:", err);
      // Fallback for strict CORS environments
      window.open(manifestation.url, '_blank');
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-full bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-slate-950/50 backdrop-blur-lg border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/70 hover:text-white"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden p-4">
          {manifestation.type === 'video' ? (
            <video src={manifestation.url} className="max-w-full max-h-[60vh] md:max-h-full rounded-2xl shadow-2xl" controls autoPlay loop />
          ) : (
            <img src={manifestation.url} alt={manifestation.prompt} className="max-w-full max-h-[60vh] md:max-h-full object-contain rounded-2xl shadow-2xl" />
          )}
        </div>

        <div className="w-full md:w-80 lg:w-96 p-8 flex flex-col bg-slate-900/50 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/5">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-[0.3em] mb-6">Manifest Record</h3>
            <div className="space-y-8">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Vision Script</span>
                <p className="text-slate-200 text-sm italic font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">"{manifestation.prompt}"</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Manifest Type</span>
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <i className={`fa-solid ${manifestation.type === 'video' ? 'fa-clapperboard text-indigo-400' : 'fa-image text-sky-400'}`}></i>
                    {manifestation.type}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Vayu Module</span>
                  <p className="text-slate-300 text-xs font-black text-sky-400 uppercase tracking-widest">{getModuleName(manifestation.model)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={handleDownload}
              disabled={isSaving}
              className={`w-full py-5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50`}
            >
              {isSaving ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-download"></i>}
              {isSaving ? 'Processing...' : 'Save Manifestation'}
            </button>
            <button 
              onClick={() => { if(confirm("Erase from archive?")) { onDelete(manifestation.id); onClose(); } }} 
              className="w-full py-4 bg-transparent hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              <i className="fa-solid fa-trash-can mr-2"></i> Erase Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
