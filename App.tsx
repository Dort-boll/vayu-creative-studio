
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Manifestation, GenerationSettings } from './types';
import { generateManifestation } from './services/puterService';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageCard from './components/ImageCard';
import ImageModal from './components/ImageModal';

const App: React.FC = () => {
  const [items, setItems] = useState<Manifestation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Manifestation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing Vayu...');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle Effect for Cosmic Atmosphere
  useEffect(() => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles: any[] = [];
    const isMobile = w < 768;
    const particleCount = isMobile ? 30 : 70;
    
    for(let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * (isMobile ? 1 : 1.5) + 0.5,
        speed: Math.random() * 0.12 + 0.05,
        opacity: Math.random() * 0.25 + 0.05
      });
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        if (p.y < -10) p.y = h + 10;
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('vayu-archive-v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch (e) {
        localStorage.removeItem('vayu-archive-v3');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vayu-archive-v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isGenerating) return;
    const phrases = ['Linking Neural Cores...', 'Architecting Vision...', 'Rendering Atmos...', 'Stabilizing Sync...'];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(phrases[i % phrases.length]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (prompt: string, settings: GenerationSettings) => {
    if (!isOnline) {
      setError("Link Disrupt: Check your connection to initiate manifestation.");
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateManifestation(prompt, settings);
      const newItem: Manifestation = {
        id: Math.random().toString(36).substr(2, 9),
        type: result.actualType,
        url: result.url,
        prompt: prompt,
        timestamp: Date.now(),
        model: settings.model,
        aspectRatio: settings.aspectRatio,
        style: settings.style
      };
      setItems(prev => [newItem, ...prev]);
    } catch (err: any) {
      setError(err.message || "A neural disruption occurred during manifestation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filterType]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-32 relative z-10 flex flex-col overflow-x-hidden">
      <Header isGenerating={isGenerating} />
      
      <main className="flex-1 container mx-auto px-4 max-w-7xl">
        <ImageGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />

        {error && (
          <div className="max-w-4xl mx-auto mb-16 glass-blue border-red-500/30 p-8 rounded-[2.5rem] flex items-center gap-8 text-red-400 animate-in fade-in slide-in-from-top-6">
            <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-xl">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400/50 mb-2">Neural Link Warning</p>
              <span className="text-sm md:text-base font-bold leading-relaxed">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-3 opacity-50 hover:opacity-100 transition-all"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>
        )}

        {/* Archive Controls */}
        <div id="archive" className="max-w-7xl mx-auto mb-12 px-2 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-2 h-16 bg-gradient-to-b from-sky-400 to-indigo-600 rounded-full transition-all duration-1000 ${isGenerating ? 'scale-y-125 shadow-[0_0_30px_#38bdf8]' : 'opacity-40'}`} />
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Archive</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3">Memory Manifestations</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                <input 
                  type="text"
                  placeholder="Search manifestations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'image', 'video'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterType === type ? 'bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 px-2">
          {filteredItems.map(m => (
            <ImageCard key={m.id} manifestation={m} onClick={setSelectedItem} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="py-40 text-center opacity-30 animate-pulse">
            <i className="fa-solid fa-ghost text-9xl text-sky-500/10 mb-10 block"></i>
            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-[0.6em]">Void Detected</h3>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] mt-6">Awaiting first neural imprinting</p>
          </div>
        )}
      </main>

      <footer className={`py-24 border-t border-white/5 mt-32 transition-opacity duration-1000 ${isGenerating ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-12 mb-12 opacity-30">
             <i className="fa-brands fa-github text-2xl hover:text-white cursor-pointer transition-colors"></i>
             <i className="fa-brands fa-twitter text-2xl hover:text-white cursor-pointer transition-colors"></i>
             <i className="fa-brands fa-discord text-2xl hover:text-white cursor-pointer transition-colors"></i>
          </div>
          <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em] leading-relaxed">
            rudratech Inc 2026 all rights reserved.
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-[10px] text-slate-700 uppercase font-black tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Network Status: Optimal</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full hidden sm:block"></span>
            <span>OS Build v2.5.8 Final</span>
          </div>
        </div>
      </footer>

      {isGenerating && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-[520px] animate-in slide-in-from-bottom-24 duration-700">
          <div className="glass-blue p-10 rounded-[3.5rem] flex items-center gap-10 border-sky-400/40 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-sky-400/10"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-sky-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500 animate-spin-reverse duration-[3s]"></div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-sky-400 uppercase tracking-[0.6em] mb-4">{loadingText}</p>
              <div className="flex gap-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="h-1.5 flex-1 bg-sky-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 animate-loading-bar" style={{ animationDelay: `${idx * 0.5}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[90] w-14 h-14 rounded-2xl glass-blue border border-sky-500/30 flex items-center justify-center text-sky-400 hover:scale-110 active:scale-95 transition-all shadow-2xl animate-in fade-in zoom-in"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      <ImageModal 
        manifestation={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))} 
      />
    </div>
  );
};

export default App;
