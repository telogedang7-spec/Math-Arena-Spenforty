import { useState, useEffect } from 'react';
import { LeaderboardEntry, PlayerStats, GameSession } from '../types';

const STATS_KEY = "math_arena_stats";
const LEADERBOARD_KEY = "math_arena_leaderboard";

const INITIAL_STATS: PlayerStats = {
  totalGames: 0,
  bestStreak: 0,
  favoriteCategory: null,
  history: [],
  achievements: []
};

const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", nickname: "Raka", category: "Mix 3", difficulty: "Mudah", score: 45, date: new Date().toISOString() },
  { id: "2", nickname: "Siti", category: "Perkalian", difficulty: "Sedang", score: 32, date: new Date().toISOString() },
  { id: "3", nickname: "Budi", category: "Penjumlahan", difficulty: "Sulit", score: 28, date: new Date().toISOString() },
  { id: "4", nickname: "Ayu", category: "Mix 1", difficulty: "Mudah", score: 21, date: new Date().toISOString() },
  { id: "5", nickname: "Dewa", category: "Pembagian", difficulty: "Sedang", score: 15, date: new Date().toISOString() },
];

export function useLeaderboard() {
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedLb = localStorage.getItem(LEADERBOARD_KEY);
    if (savedLb) {
      setLeaderboard(JSON.parse(savedLb));
    } else {
      setLeaderboard(DUMMY_LEADERBOARD);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(DUMMY_LEADERBOARD));
    }
  }, []);

  const saveSession = (session: GameSession) => {
    const newStats = { 
      ...stats,
      history: [...stats.history, session],
      achievements: [...stats.achievements]
    };
    
    newStats.totalGames += 1;
    if (session.maxStreak > newStats.bestStreak) {
      newStats.bestStreak = session.maxStreak;
    }

    // Calculate favorite category
    const catCounts = newStats.history.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let favCat = null;
    let max = 0;
    for (const [cat, count] of Object.entries(catCounts)) {
      if ((count as number) > max) {
        max = count as number;
        favCat = cat as any;
      }
    }
    newStats.favoriteCategory = favCat;

    // Achievements logic
    if (session.maxStreak >= 50 && !newStats.achievements.includes("Iron Streak")) {
      newStats.achievements.push("Iron Streak");
    }

    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));

    // Update leaderboard
    const newEntry: LeaderboardEntry = {
      id: session.id,
      nickname: session.nickname,
      category: session.category,
      difficulty: session.difficulty,
      score: session.score,
      date: session.date
    };
    
    const newLb = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 50); // Keep top 50
    setLeaderboard(newLb);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newLb));
  };

  const clearData = () => {
    setStats(INITIAL_STATS);
    setLeaderboard(DUMMY_LEADERBOARD);
    localStorage.removeItem(STATS_KEY);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(DUMMY_LEADERBOARD));
  };

  return { stats, leaderboard, saveSession, clearData };
}
