import { motion } from 'motion/react';
import { ChevronLeft, Volume2, VolumeX, Sparkles, Eye, Trash2 } from 'lucide-react';

interface SettingsProps {
  key?: string;
  onBack: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  animEnabled: boolean;
  setAnimEnabled: (v: boolean) => void;
  clearData: () => void;
}

export function Settings({ onBack, soundEnabled, setSoundEnabled, animEnabled, setAnimEnabled, clearData }: SettingsProps) {
  
  const handleClear = () => {
    if (window.confirm("Yakin ingin mereset semua statistik dan leaderboard lokal?")) {
      clearData();
      alert("Data berhasil direset!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-[#1E293B] rounded-2xl border border-slate-700 hover:bg-slate-700 transition-colors">
          <ChevronLeft />
        </button>
        <h1 className="text-4xl font-display font-bold text-white">Pengaturan</h1>
      </div>

      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 space-y-6">
        
        <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-cyan/20 text-brand-cyan rounded-lg"><Volume2 size={24}/></div>
            <div>
              <div className="font-bold text-white text-lg">Efek Suara</div>
              <div className="text-sm text-slate-400">Aktifkan efek suara dalam game</div>
            </div>
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${soundEnabled ? 'bg-brand-cyan' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 bottom-1 w-6 bg-white rounded-full transition-all ${soundEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-purple/20 text-brand-purple rounded-lg"><Sparkles size={24}/></div>
            <div>
              <div className="font-bold text-white text-lg">Animasi Partikel</div>
              <div className="text-sm text-slate-400">Efek visual & confetti (matikan jika lag)</div>
            </div>
          </div>
          <button 
            onClick={() => setAnimEnabled(!animEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${animEnabled ? 'bg-brand-purple' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 bottom-1 w-6 bg-white rounded-full transition-all ${animEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        <div className="border-t border-slate-700 pt-6 mt-6">
          <button 
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-bold hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={20} />
            Reset Semua Data Lokal
          </button>
        </div>

      </div>
    </motion.div>
  );
}
