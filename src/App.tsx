import { useState } from 'react';
import { Category, Difficulty, GameSession } from './types';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';
import { Stats } from './components/Stats';
import { AnimatePresence } from 'motion/react';
import { useLeaderboard } from './hooks/useLeaderboard';
import { Settings } from './components/Settings';

export type ScreenState = "home" | "game" | "gameover" | "stats" | "settings";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("home");
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState<Category>("Penjumlahan");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mudah");
  
  const [lastSession, setLastSession] = useState<GameSession | null>(null);
  
  const { stats, leaderboard, saveSession, clearData } = useLeaderboard();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(true);

  const startGame = (nick: string, cat: Category, diff: Difficulty) => {
    setNickname(nick);
    setCategory(cat);
    setDifficulty(diff);
    setScreen("game");
  };

  const onGameOver = (session: GameSession) => {
    setLastSession(session);
    saveSession(session);
    setScreen("gameover");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-center p-4 md:p-8 font-body">
      <div className="w-full max-w-6xl mx-auto relative flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <Home 
              key="home" 
              onStart={startGame} 
              leaderboard={leaderboard} 
              stats={stats} 
              onOpenStats={() => setScreen("stats")}
              onOpenSettings={() => setScreen("settings")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              initialNickname={nickname}
            />
          )}
          {screen === "game" && (
            <Game 
              key="game" 
              nickname={nickname}
              category={category}
              difficulty={difficulty}
              onGameOver={onGameOver}
              soundEnabled={soundEnabled}
            />
          )}
          {screen === "gameover" && lastSession && (
            <GameOver 
              key="gameover" 
              session={lastSession}
              onPlayAgain={() => setScreen("game")}
              onHome={() => setScreen("home")}
              onStats={() => setScreen("stats")}
            />
          )}
          {screen === "stats" && (
            <Stats 
              key="stats"
              stats={stats}
              onBack={() => setScreen("home")}
            />
          )}
          {screen === "settings" && (
            <Settings
              key="settings"
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              animEnabled={animEnabled}
              setAnimEnabled={setAnimEnabled}
              clearData={clearData}
              onBack={() => setScreen("home")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
