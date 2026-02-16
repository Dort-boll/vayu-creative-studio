import React from 'react';

interface HeaderProps {
  isGenerating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isGenerating }) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:py-6 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className={`glass-blue rounded-2xl md:rounded-[2.5rem] px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border overflow-hidden relative group transition-all duration-1000 ${isGenerating ? 'border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.1)]' : 'border-white/10'}`}>
            <div className="absolute inset-0 shimmer-bg opacity-30"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center transition-all duration-700 border border-white/20 ${isGenerating ? 'animate-pulse scale-105 shadow-[0_0_20px_rgba(56,189,248,0.3)]' : ''}`}>
                <i className="fa-solid fa-wind text-white text-sm md:text-lg"></i>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-xl font-black tracking-tighter text-white leading-none">
                  VAYU <span className="text-sky-400">AGI</span>
                </h1>
                <span className="text-[6px] md:text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black mt-1">Creative Node</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 relative z-10">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/5 transition-all ${isGenerating ? 'bg-sky-500/10 border-sky-400/20' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'}`}></div>
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-300">
                  {isGenerating ? 'Active' : 'Standby'}
                </span>
              </div>
              <div className="hidden sm:flex gap-4">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Neural</button>
                <button onClick={() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })} className="text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Archive</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 md:pt-44 pb-10 md:pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 rounded-full glass-panel border border-sky-500/20 text-sky-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-6">
            Neural Synthesis Engine
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            Manifesting <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Pure Imagination</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed opacity-80 px-4">
            A real-time generative studio powered by Vayu Neural Architecture. Synthesis refined for speed, fidelity, and absolute creative freedom.
          </p>
        </div>
      </section>
    </>
  );
};

export default Header;