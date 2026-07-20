import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Difficulty, LeaderboardEntry, PlayerStats } from '../types';
import { cn } from '../lib/utils';
import { Settings as SettingsIcon, BarChart2, Play, Volume2, VolumeX } from 'lucide-react';

interface HomeProps {
  key?: string;
  onStart: (nickname: string, cat: Category, diff: Difficulty) => void;
  leaderboard: LeaderboardEntry[];
  stats: PlayerStats;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  initialNickname: string;
}

const CATEGORIES: Category[] = [
  "Penjumlahan", "Pengurangan", "Perkalian", "Pembagian", "Mix 1", "Mix 2", "Mix 3"
];

const DIFFICULTIES: Difficulty[] = ["Mudah", "Sedang", "Sulit"];

export function Home({ onStart, leaderboard, stats, onOpenStats, onOpenSettings, soundEnabled, setSoundEnabled, initialNickname }: HomeProps) {
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("Mudah");
  const [nickname, setNickname] = useState(initialNickname || "");
  
  const [leaderboardCat, setLeaderboardCat] = useState<Category>("Penjumlahan");
  const [leaderboardDiff, setLeaderboardDiff] = useState<Difficulty>("Mudah");

  const handleStart = () => {
    if (!nickname.trim() || !selectedCat) return;
    onStart(nickname.trim(), selectedCat, selectedDiff);
  };

  const getCategoryStyles = (cat: Category) => {
    switch (cat) {
      case "Penjumlahan": return "bg-gradient-to-br from-[#A855F7] to-[#7C3AED] border-white/10 shadow-lg border-4";
      case "Pengurangan": return "bg-gradient-to-br from-[#22D3EE] to-[#0891B2] border-white/10 shadow-lg border-4";
      case "Perkalian": return "bg-gradient-to-br from-[#FB923C] to-[#EA580C] border-white/10 shadow-lg border-4";
      case "Pembagian": return "bg-gradient-to-br from-[#EC4899] to-[#BE185D] border-white/10 shadow-lg border-4";
      case "Mix 1": return "bg-[#1E293B] border border-slate-700 shadow-lg";
      case "Mix 2": return "bg-[#1E293B] border border-slate-700 shadow-lg";
      case "Mix 3": return "bg-[#1E293B] border-2 border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.2)]";
      default: return "bg-[#1E293B] border border-slate-700";
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "Penjumlahan": return "➕";
      case "Pengurangan": return "➖";
      case "Perkalian": return "✖️";
      case "Pembagian": return "➗";
      case "Mix 1": return "➕➖";
      case "Mix 2": return "✖️➗";
      case "Mix 3": return "⚡";
      default: return "❓";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full gap-6 max-w-5xl mx-auto w-full"
    >
      {/* Top Header / Global Stats */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#22D3EE] bg-clip-text text-transparent uppercase font-display leading-none">
              MATH ARENA
            </h1>
            <span className="text-sm md:text-base font-bold tracking-widest text-slate-400 mt-1">
              SPENFORTY
            </span>
          </div>
          <span className="hidden md:inline-block px-3 py-1 bg-[#1E293B] rounded-full text-xs font-bold border border-[#A855F7]/30 text-[#A855F7]">
            SURVIVAL MODE
          </span>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Total Games</span>
            <span className="text-xl font-bold text-white">{stats.totalGames}</span>
          </div>
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] uppercase text-[#FB923C] font-bold tracking-widest">Best Streak</span>
            <span className="text-xl font-bold text-white">🔥 {stats.bestStreak}</span>
          </div>
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] uppercase text-[#22D3EE] font-bold tracking-widest">Fav Kategori</span>
            <span className="text-sm font-bold text-white truncate max-w-[80px]">{stats.favoriteCategory || "-"}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
        
        {/* Left Panel: Categories & Difficulty */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-4 flex flex-col sm:flex-row justify-between sm:items-end mb-1 gap-2">
              <h2 className="text-xl font-bold text-[#A855F7]">Pilih Operasi</h2>
              <div className="flex bg-[#1E293B] p-1 rounded-xl shrink-0">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDiff(diff)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-colors",
                      selectedDiff === diff ? "bg-[#A855F7] text-white" : "text-slate-400"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Cards */}
            {CATEGORIES.map(cat => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  "p-4 rounded-3xl cursor-pointer flex flex-col items-center justify-center gap-2 aspect-square",
                  getCategoryStyles(cat),
                  selectedCat === cat && "ring-4 ring-white"
                )}
              >
                <span className="text-3xl md:text-4xl whitespace-nowrap">{getCategoryIcon(cat)}</span>
                <span className="font-bold text-[10px] md:text-xs uppercase tracking-tight text-center">{cat}</span>
              </motion.div>
            ))}
          </div>

          {/* Selected Category Context / Start Game */}
          <div className="bg-[#1E293B] flex-1 rounded-[2.5rem] p-6 md:p-8 border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xs w-full text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">SIAP BERTARUNG?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Kategori: <span className="text-white font-bold">{selectedCat || "?"}</span> • Level: <span className="text-[#FB923C] font-bold">{selectedDiff}</span>
              </p>
              <div className="flex flex-col gap-2 w-full">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter">NICKNAME</div>
                <input 
                  type="text" 
                  maxLength={15}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Masukkan nama..."
                  className="w-full bg-[#0F172A] border-2 border-slate-700 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#A855F7] transition-colors text-white placeholder-slate-500"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              disabled={!nickname.trim() || !selectedCat}
              className="h-32 w-32 md:h-40 md:w-40 rounded-full shrink-0 bg-gradient-to-tr from-[#A855F7] to-[#EC4899] text-white font-black text-xl md:text-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex flex-col items-center justify-center transition-transform"
            >
              <span className="text-sm opacity-80 mb-1">START</span>
              MULAI
              <span className="mt-1 text-xs">⚡⚡⚡</span>
            </motion.button>
          </div>
        </div>

        {/* Right Panel: Leaderboard */}
        <div className="lg:w-1/3 bg-[#111827] rounded-[2.5rem] border border-slate-700 p-6 flex flex-col h-[500px] lg:h-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-[#FB923C]">🏆</span> LEADERBOARD
            </h2>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            {/* Category Tabs */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setLeaderboardCat(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors",
                    leaderboardCat === cat ? "bg-[#22D3EE] text-slate-900" : "bg-slate-800 text-slate-400 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Difficulty Tabs */}
            <div className="flex gap-1">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setLeaderboardDiff(diff)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors flex-1",
                    leaderboardDiff === diff ? "bg-[#FB923C] text-slate-900" : "bg-slate-800 text-slate-400 hover:text-white"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
            {leaderboard.filter(entry => entry.category === leaderboardCat && entry.difficulty === leaderboardDiff).length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">
                Belum ada skor untuk kategori ini.
                <br/>
                Jadilah yang pertama!
              </div>
            ) : (
              leaderboard
                .filter(entry => entry.category === leaderboardCat && entry.difficulty === leaderboardDiff)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10).map((entry, idx) => (
                <div key={entry.id} className={cn(
                  "p-3 rounded-2xl flex items-center gap-3 md:gap-4",
                  idx === 0 ? "bg-[#1E293B] border-l-4 border-[#FB923C]" :
                  idx === 1 ? "bg-[#1E293B] border-l-4 border-slate-400" :
                  idx === 2 ? "bg-[#1E293B] border-l-4 border-[#B45309]" :
                  idx < 3 ? "bg-[#1E293B] border-l-4 border-slate-700" :
                  "bg-[#1E293B]/50 border-l-4 border-transparent opacity-75"
                )}>
                  <span className={cn(
                    "text-lg font-black w-4 text-center",
                    idx === 0 ? "text-[#FB923C]" :
                    idx === 1 ? "text-slate-400" :
                    idx === 2 ? "text-[#B45309]" :
                    "text-slate-500"
                  )}>{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{entry.nickname}</div>
                    <div className="text-[10px] text-slate-500 truncate">{entry.category}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn(
                      "font-black",
                      idx === 0 ? "text-[#FB923C]" :
                      idx === 1 ? "text-slate-200" :
                      idx === 2 ? "text-[#B45309]" :
                      "text-slate-400"
                    )}>{entry.score}</div>
                    {idx === 0 && <div className="text-[8px] text-slate-500 uppercase">Score</div>}
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={onOpenStats} className="mt-6 w-full py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors">
            Lihat Statistik Lengkap
          </button>
        </div>
      </div>

      {/* Bottom Navbar / Settings */}
      <footer className="mt-2 flex justify-between items-center text-xs text-slate-500 uppercase font-bold tracking-widest flex-wrap gap-4">
        <div className="flex gap-4 md:gap-8">
          <div onClick={onOpenSettings} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <span className="text-lg">⚙️</span> PENGATURAN
          </div>
          <div onClick={onOpenStats} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <span className="text-lg">📊</span> STATISTIK
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSoundEnabled(!soundEnabled)}>
            <span>SFX</span>
            <div className={cn("w-10 h-5 rounded-full flex items-center px-1 transition-colors", soundEnabled ? "bg-[#22D3EE]" : "bg-slate-700")}>
              <div className={cn("w-3 h-3 bg-white rounded-full transition-all", soundEnabled ? "ml-auto" : "")}></div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
