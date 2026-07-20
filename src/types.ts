export type Difficulty = "Mudah" | "Sedang" | "Sulit";

export type Category = 
  | "Penjumlahan"
  | "Pengurangan"
  | "Perkalian"
  | "Pembagian"
  | "Mix 1"
  | "Mix 2"
  | "Mix 3";

export interface PlayerStats {
  totalGames: number;
  bestStreak: number;
  favoriteCategory: Category | null;
  history: GameSession[];
  achievements: string[];
}

export interface GameSession {
  id: string;
  nickname: string;
  category: Category;
  difficulty: Difficulty;
  score: number;
  maxStreak: number;
  date: string;
  accuracy: number;
  avgTimePerQuestion: number;
  worstOperation?: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  category: Category;
  difficulty: Difficulty;
  score: number;
  date: string;
}

export interface MathQuestion {
  text: string;
  answer: number;
  operation: string;
  isBoss?: boolean;
}

export interface AppSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
}
