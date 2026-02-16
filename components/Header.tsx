import React from 'react';

interface HeaderProps {
  isGenerating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isGenerating }) => {
  return (
    <>
      {/* Dynamic Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:py-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className={`glass-blue rounded-2xl md:rounded-[3rem] px-4 md:px-10 py-3 md:py-4 flex items-center justify-between border overflow-hidden relative group transition-all duration-1000 ${isGenerating ? 'border-sky-400/40' : 'border-white/10'}`}>
            <div className="absolute inset-0 shimmer-bg opacity-30 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 md:gap-5 relative z-10">
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center transition-all duration-700 border border-white/20 ${isGenerating ? 'animate-pulse scale-110' : ''}`}>
                <i className="fa-solid fa-wind text-white text-base md:text-xl"></i>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base md:text-2xl font-black tracking-tighter text-white leading-none">
                  VAYU <span className="text-sky-400">AGI</span>
                </h1>
                <span className="text-[6px] md:text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black mt-1">Core Engine</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-8 relative z-10">
              <div className={`flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full glass-panel border transition-all ${isGenerating ? 'border-sky-400/30 bg-sky-500/5' : 'border-white/5'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-sky-400'}`}></div>
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {isGenerating ? 'Active' : 'Standby'}
                </span>
              </div>
              <div className="hidden sm:flex gap-6 md:gap-8 ml-2">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Neural</button>
                <button onClick={() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })} className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Archive</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Fluid Hero Section */}
      <section className="pt-28 md:pt-48 pb-8 md:pb-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 rounded-full glass-panel border border-sky-500/20 text-sky-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Next-Gen Synthesis
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Design the <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Future</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed px-4 opacity-80">
            Real-time creativity powered by Puter Neural Modules. <br className="hidden sm:block" />
            High-fidelity imagery and cinema, synthesized in seconds.
          </p>
        </div>
      </section>
    </>
  );
};

export default Header;