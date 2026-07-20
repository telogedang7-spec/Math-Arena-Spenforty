import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { GameSession } from '../types';
import { getTitle } from '../lib/titles';
import { Share2, RotateCcw, BarChart2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface GameOverProps {
  key?: string;
  session: GameSession;
  onPlayAgain: () => void;
  onHome: () => void;
  onStats: () => void;
}

export function GameOver({ session, onPlayAgain, onHome, onStats }: GameOverProps) {
  const title = getTitle(session.score);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const motivation = (() => {
    if (session.score >= 50) return "Luar biasa! Perhitungan yang sangat akurat! 🔥";
    if (session.score >= 30) return "Kerja bagus! Sedikit lagi kamu bisa memecahkan rekor! 🚀";
    if (session.score >= 10) return "Awal yang baik! Terus berlatih agar lebih cepat! 💪";
    return "Jangan menyerah! Setiap ahli dimulai dari pemula. Coba lagi! ✨";
  })();

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGeneratingImg(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#020617', // slate-950
        scale: 2,
      });
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `MathArena_${session.nickname}_${session.score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Gagal membuat gambar.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto"
    >
      <div 
        ref={cardRef} 
        className="bg-[#1E293B] border border-slate-700 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Glow effect for high scores */}
        {session.score >= 50 && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-transparent to-brand-cyan/20 animate-pulse pointer-events-none" />
        )}

        <h1 className="text-4xl font-display font-bold text-red-500 mb-2">GAME OVER</h1>
        
        <div className="my-8">
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Final Score</div>
          <div className="text-7xl font-display font-bold text-white mb-2">{session.score}</div>
          
          <div className={cn(
            "inline-block px-6 py-2 rounded-full font-bold text-lg border-2",
            session.score >= 70 ? "bg-brand-pink/20 text-brand-pink border-brand-pink shadow-[0_0_15px_rgba(236,72,153,0.5)]" :
            session.score >= 40 ? "bg-brand-purple/20 text-brand-purple border-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]" :
            "bg-slate-800 text-slate-300 border-slate-700"
          )}>
            Gelar: {title}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-700">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Akurasi</div>
            <div className="text-2xl font-bold text-brand-cyan">{session.accuracy}%</div>
          </div>
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-700">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Kecepatan</div>
            <div className="text-2xl font-bold text-brand-orange">{session.avgTimePerQuestion}s</div>
          </div>
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-700 col-span-2 flex justify-between items-center">
            <div className="text-xs text-slate-500 uppercase font-bold">Max Streak</div>
            <div className="text-xl font-bold text-white">{session.maxStreak} 🔥</div>
          </div>
        </div>

        <div className="bg-brand-purple/10 border border-brand-purple/30 p-4 rounded-2xl text-center min-h-[80px] flex items-center justify-center">
          <p className="text-slate-200 font-medium italic text-sm md:text-base">"{motivation}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <button 
          onClick={handleShare}
          disabled={isGeneratingImg}
          className="col-span-1 md:col-span-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          {isGeneratingImg ? <Loader2 className="animate-spin" /> : <Share2 />}
          Simpan Kartu Hasil
        </button>
        <button 
          onClick={onPlayAgain}
          className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-cyan/20"
        >
          <RotateCcw /> Main Lagi
        </button>
        <button 
          onClick={onStats}
          className="bg-brand-purple hover:bg-purple-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-purple/20"
        >
          <BarChart2 /> Statistik
        </button>
        <button 
          onClick={onHome}
          className="col-span-1 md:col-span-2 text-slate-500 hover:text-white font-bold py-3 transition-colors mt-2"
        >
          Kembali ke Menu Utama
        </button>
      </div>

    </motion.div>
  );
}
