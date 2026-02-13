
import React from 'react';

interface HeaderProps {
  isGenerating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isGenerating }) => {
  return (
    <>
      {/* Sticky Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className={`glass-blue rounded-[1.5rem] md:rounded-[2.5rem] px-6 md:px-10 py-3 md:py-5 flex items-center justify-between border overflow-hidden relative group transition-all duration-1000 box-glow ${isGenerating ? 'border-sky-400/50' : 'border-white/5'}`}>
            <div className={`absolute inset-0 shimmer-bg transition-opacity duration-1000 ${isGenerating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
            
            <div className="flex items-center gap-3 md:gap-5 relative z-10">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center transition-all duration-700 ${isGenerating ? 'scale-110 shadow-[0_0_25px_rgba(56,189,248,0.5)]' : 'group-hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.2)]'}`}>
                <i className="fa-solid fa-wind text-white text-lg md:text-2xl"></i>
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white leading-none">
                  VAYU <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">AGI</span>
                </h1>
                <p className="hidden sm:block text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-sky-400/50 font-black mt-1 md:mt-2">Creative OS v2.5</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-10 relative z-10">
              <div className={`flex items-center gap-2 md:gap-4 px-3 md:px-6 py-1.5 md:py-2.5 rounded-full bg-slate-950/40 border transition-all ${isGenerating ? 'border-sky-400/40' : 'border-white/5'}`}>
                <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full animate-pulse ${isGenerating ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'}`}></div>
                <span className={`text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors ${isGenerating ? 'text-amber-400' : 'text-sky-400/90'}`}>
                  {isGenerating ? 'Manifesting' : 'Link Active'}
                </span>
              </div>
              <div className="hidden lg:block h-8 w-[1px] bg-white/10"></div>
              <div className="hidden lg:flex gap-8">
                <button className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.3em]">Modules</button>
                <button onClick={() => document.getElementById('archive')?.scrollIntoView()} className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.3em]">Archive</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-10 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Next-Gen Generative Intelligence
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-10 leading-[1.1] md:leading-[1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            Manifest the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Impossible</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-200 px-4">
            Experience the synergy of cosmic intelligence and neural artistry through the 
            pioneering <span className="text-sky-400 font-bold italic tracking-wide">Vayu Modules</span>.
          </p>
        </div>
      </section>
    </>
  );
};

export default Header;
