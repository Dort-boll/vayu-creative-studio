import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Manifestation, GenerationSettings } from './types';
import { generateManifestation } from './services/puterService';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageCard from './components/ImageCard';
import ImageModal from './components/ImageModal';

const ARCHIVE_KEY = 'vayu-archive-v6';

const App: React.FC = () => {
  const [items, setItems] = useState<Manifestation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Manifestation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Syncing Neural Link...');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARCHIVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(i => i && i.url && typeof i.url === 'string').slice(0, 40);
          setItems(validItems);
        }
      }
    } catch (e) {
      localStorage.removeItem(ARCHIVE_KEY);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storableItems = items
        .filter(item => item.url && !item.url.startsWith('data:'))
        .slice(0, 30);
      try {
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(storableItems));
      } catch (e) {
        setItems(prev => prev.slice(0, 10));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [items]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles = Array.from({ length: w < 768 ? 20 : 50 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.12 + 0.04,
      opacity: Math.random() * 0.3 + 0.1
    }));

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) p.y = h + 10;
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  const handleGenerate = async (prompt: string, settings: GenerationSettings) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    setLoadingText('Initializing Synthesis...');
    
    try {
      const result = await generateManifestation(prompt, settings);
      
      const newItem: Manifestation = {
        id: Math.random().toString(36).substring(2, 11),
        type: result.actualType,
        url: result.url,
        prompt: prompt,
        timestamp: Date.now(),
        model: settings.model,
        aspectRatio: settings.aspectRatio,
        style: settings.style
      };

      setItems(prev => [newItem, ...prev]);
      
      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err: any) {
      setError(err.message || "A neural disruption occurred during synthesis.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearArchive = () => {
    if (window.confirm("Are you sure you want to permanently clear your creative archive?")) {
      setItems([]);
      localStorage.removeItem(ARCHIVE_KEY);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filterType]);

  return (
    <div className={`min-h-screen pb-32 flex flex-col ${isGenerating ? 'is-generating' : ''}`}>
      <Header isGenerating={isGenerating} />
      
      <main className="flex-1 container mx-auto px-4 max-w-7xl relative">
        <ImageGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />

        {error && (
          <div className="max-w-4xl mx-auto mb-16 glass-blue border-red-500/40 p-8 rounded-[2rem] flex items-center gap-6 text-red-400 animate-in slide-in-from-top-4">
            <i className="fa-solid fa-triangle-exclamation text-3xl opacity-50"></i>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Synthesis Failed</p>
              <span className="text-sm font-bold">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        )}

        <div id="archive" className="mb-12 scroll-mt-32">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <div className={`w-1 h-12 bg-sky-400 rounded-full ${isGenerating ? 'animate-pulse' : 'opacity-40'}`} />
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Creative Archive</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1">Stored Manifestations</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                <input 
                  type="text"
                  placeholder="Scan memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-sky-500/50 transition-all"
                />
              </div>
              <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
                {(['all', 'image', 'video'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {items.length > 0 && (
                <button 
                  onClick={clearArchive}
                  className="px-4 py-2 rounded-xl text-[9px] font-black uppercase text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all border border-red-500/10"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(m => (
            <ImageCard key={m.id} manifestation={m} onClick={setSelectedItem} />
          ))}
        </div>
        
        {filteredItems.length === 0 && !isGenerating && (
          <div className="py-40 text-center opacity-10">
            <i className="fa-solid fa-wind text-8xl mb-8 block"></i>
            <h3 className="text-xl font-black uppercase tracking-[0.5em]">Archive Empty</h3>
          </div>
        )}
      </main>

      {isGenerating && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm">
          <div className="glass-blue p-6 rounded-[2rem] flex items-center gap-6 border-sky-500/40 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 shimmer-bg opacity-20"></div>
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-sky-400/20"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin"></div>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-[9px] font-black text-sky-400 uppercase tracking-[0.3em] mb-2">{loadingText}</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 animate-loading-bar" style={{ width: '100%', animation: 'loading-bar 2s infinite linear' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-xl glass-blue border border-sky-500/30 text-sky-400 flex items-center justify-center animate-in zoom-in"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      <ImageModal 
        manifestation={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))} 
      />

      <footer className="py-20 border-t border-white/5 mt-32 text-center opacity-40">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] mb-4">Vayu Creative Engine • AGI Edition</p>
        <p className="text-[8px] text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
          Cloud-native intelligence. Built with Vayu Neural Framework.<br/>
          © Rudratech Inc 2026. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;