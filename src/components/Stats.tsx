import { motion } from 'motion/react';
import { ChevronLeft, Award, TrendingUp, Target } from 'lucide-react';
import { PlayerStats, Category } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface StatsProps {
  key?: string;
  onBack: () => void;
  stats: PlayerStats;
}

const CAT_COLORS: Record<Category, string> = {
  "Penjumlahan": "#22D3EE", // cyan
  "Pengurangan": "#FB923C", // orange
  "Perkalian": "#A855F7", // purple
  "Pembagian": "#EC4899", // pink
  "Mix 1": "#34D399", // emerald
  "Mix 2": "#FBBF24", // amber
  "Mix 3": "#F87171"  // red
};

export function Stats({ onBack, stats }: StatsProps) {
  
  const historyData = stats.history.map((h, i) => ({
    name: `Game ${i + 1}`,
    score: h.score,
    streak: h.maxStreak
  })).slice(-20); // show last 20 games

  const catCounts = stats.history.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(catCounts).map(([name, value]) => ({
    name, value
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-[#1E293B] rounded-2xl border border-slate-700 hover:bg-slate-700 transition-colors">
          <ChevronLeft />
        </button>
        <h1 className="text-4xl font-display font-bold text-white">Statistik Pemain</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#A855F7]/30 flex items-center gap-4">
          <div className="p-4 bg-[#A855F7]/20 text-[#A855F7] rounded-2xl"><TrendingUp size={32}/></div>
          <div>
            <div className="text-slate-400">Total Main</div>
            <div className="text-3xl font-display font-bold text-white">{stats.totalGames}</div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#FB923C]/30 flex items-center gap-4">
          <div className="p-4 bg-[#FB923C]/20 text-[#FB923C] rounded-2xl"><Award size={32}/></div>
          <div>
            <div className="text-slate-400">Best Streak</div>
            <div className="text-3xl font-display font-bold text-white">{stats.bestStreak}</div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#22D3EE]/30 flex items-center gap-4">
          <div className="p-4 bg-[#22D3EE]/20 text-[#22D3EE] rounded-2xl"><Target size={32}/></div>
          <div>
            <div className="text-slate-400">Fav Kategori</div>
            <div className="text-xl font-display font-bold text-white truncate max-w-[120px]">{stats.favoriteCategory || "-"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Tren Skor (20 Game Terakhir)</h2>
          <div className="h-64 w-full">
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" hide />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" name="Skor" dataKey="score" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4, fill: "#22D3EE" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">Belum ada data permainan.</div>
            )}
          </div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Distribusi Kategori</h2>
          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" hide />
                  <YAxis dataKey="name" type="category" stroke="#e2e8f0" width={100} tick={{fill: '#e2e8f0', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Main" radius={[0, 4, 4, 0]}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CAT_COLORS[entry.name as Category] || "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">Belum ada data permainan.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Achievements (Badge)</h2>
        {stats.achievements.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {stats.achievements.map((a, i) => (
              <div key={i} className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-full text-amber-400 font-bold flex items-center gap-2">
                <Award size={18} />
                {a}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500">Belum ada achievement yang terbuka.</div>
        )}
      </div>

    </motion.div>
  );
}
