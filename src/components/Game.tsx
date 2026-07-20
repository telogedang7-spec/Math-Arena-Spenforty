import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { Category, Difficulty, MathQuestion, GameSession } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { generateLocalQuestion } from '../lib/mathLogic';
import { cn } from '../lib/utils';
import { Shield, Clock, Zap } from 'lucide-react';

interface GameProps {
  key?: string;
  nickname: string;
  category: Category;
  difficulty: Difficulty;
  onGameOver: (session: GameSession) => void;
  soundEnabled: boolean;
}

type PowerUp = "time" | "shield";

export function Game({ nickname, category, difficulty, onGameOver, soundEnabled }: GameProps) {
  const { playCorrect, playWrong, playPowerup, initAudio } = useSound(soundEnabled);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [inputValue, setInputValue] = useState("");
  
  const [shieldActive, setShieldActive] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<{type: PowerUp, id: string} | null>(null);
  
  const [isWrongAnim, setIsWrongAnim] = useState(false);
  
  // Timing state
  const getInitialTime = () => {
    if (difficulty === "Mudah") return 12;
    if (difficulty === "Sedang") return 10;
    return 8;
  };
  
  const [baseTime, setBaseTime] = useState(getInitialTime());
  
  const handleTimeUp = () => {
    if (shieldActive) {
      setShieldActive(false);
      setStreak(0);
      setCombo(1);
      nextQuestion();
      playPowerup(); // sound for shield break
    } else {
      endGame(false);
    }
  };

  const { timeLeft, setTimeLeft, resetTimer, stopTimer } = useTimer({
    initialTime: baseTime,
    onTimeUp: handleTimeUp,
    enabled: true
  });
  
  // Metrics for stats
  const sessionStartTime = useRef(Date.now());
  const questionStartTime = useRef(Date.now());
  const totalReactionTime = useRef(0);
  const questionsAnswered = useRef(0);
  const wrongOpsCount = useRef<Record<string, number>>({});

  useEffect(() => {
    initAudio();
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextQuestion = (currentStreak: number = streak) => {
    setInputValue("");
    
    const q = generateLocalQuestion(category, difficulty);
    setQuestion(q);
    
    // Calculate new base time (decrease 10% every 10 streak)
    const reductions = Math.floor(currentStreak / 10);
    let newTime = getInitialTime() * Math.pow(0.9, reductions);
    if (newTime < 2) newTime = 2; // min 2 seconds
    setBaseTime(newTime);
    resetTimer(newTime);
    
    questionStartTime.current = Date.now();

    // Random powerup spawn (15% chance, only if no active powerup)
    if (!activePowerUp && Math.random() < 0.15 && currentStreak > 2) {
      const type = Math.random() > 0.5 ? "time" : "shield";
      const id = uuidv4();
      setActivePowerUp({ type, id });
      setTimeout(() => {
        setActivePowerUp(prev => prev?.id === id ? null : prev);
      }, 2000);
    }
  };

  const handlePowerupClick = () => {
    if (!activePowerUp) return;
    playPowerup();
    if (activePowerUp.type === "time") {
      setTimeLeft(prev => prev + 3);
    } else if (activePowerUp.type === "shield") {
      setShieldActive(true);
    }
    setActivePowerUp(null);
  };

  const endGame = (timeout: boolean) => {
    stopTimer();
    playWrong();
    
    if (timeout && question) {
      wrongOpsCount.current[question.operation] = (wrongOpsCount.current[question.operation] || 0) + 1;
    }

    const accuracy = questionsAnswered.current > 0 ? (score / (questionsAnswered.current + (timeout ? 0 : 1))) * 100 : 0;
    const avgTime = questionsAnswered.current > 0 ? totalReactionTime.current / questionsAnswered.current / 1000 : 0;
    
    let worstOp = undefined;
    let maxWrong = 0;
    for (const [op, count] of Object.entries(wrongOpsCount.current)) {
      if ((count as number) > maxWrong) {
        maxWrong = count as number;
        worstOp = op;
      }
    }

    const session: GameSession = {
      id: uuidv4(),
      nickname,
      category,
      difficulty,
      score,
      maxStreak,
      date: new Date().toISOString(),
      accuracy: Math.round(accuracy),
      avgTimePerQuestion: parseFloat(avgTime.toFixed(2)),
      worstOperation: worstOp
    };
    
    onGameOver(session);
  };

  const handleInputStr = useCallback((key: string) => {
    if (!question || timeLeft <= 0) return;
    
    let newVal = inputValue;
    if (key === 'DEL') {
      newVal = newVal.slice(0, -1);
    } else if (key === '-') {
      if (newVal === '') newVal = '-';
    } else if (/^[0-9]$/.test(key)) {
      newVal += key;
    } else {
      return;
    }
    
    setInputValue(newVal);

    if (newVal === '' || newVal === '-') return;

    const ans = parseFloat(newVal);
    const answerStr = question.answer.toString();

    if (!isNaN(ans) && ans === question.answer) {
      // Correct!
      playCorrect();
      questionsAnswered.current += 1;
      totalReactionTime.current += (Date.now() - questionStartTime.current);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      const newCombo = Math.floor((newStreak - 1) / 10) + 1;
      setCombo(newCombo);
      
      setScore(s => s + 1);

      if (newStreak % 10 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#22D3EE', '#FB923C', '#EC4899']
        });
      }
      nextQuestion(newStreak);
    } else if (newVal.length >= answerStr.length && newVal !== answerStr) {
      // Wrong!
      playWrong();
      setIsWrongAnim(true);
      setTimeout(() => setIsWrongAnim(false), 500);
      setInputValue("");
      
      wrongOpsCount.current[question.operation] = (wrongOpsCount.current[question.operation] || 0) + 1;
      
      if (shieldActive) {
        setShieldActive(false);
      }
      setStreak(0);
      setCombo(1);
    }
  }, [inputValue, question, timeLeft, streak, maxStreak, shieldActive, playCorrect, playWrong]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!question || timeLeft <= 0) return;
      if (e.key >= '0' && e.key <= '9') {
        handleInputStr(e.key);
      } else if (e.key === '-' || e.key === 'Backspace') {
        handleInputStr(e.key === 'Backspace' ? 'DEL' : '-');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInputStr, question, timeLeft]);

  // Timer visual logic
  const timePercent = (timeLeft / baseTime) * 100;
  const timerColor = timePercent > 50 ? "bg-brand-cyan" : timePercent > 25 ? "bg-brand-orange" : "bg-red-500 animate-pulse";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className={cn("w-full max-w-2xl mx-auto", isWrongAnim && "animate-[shake_0.5s_ease-in-out]")}
    >
      {/* Header Info */}
      <div className="flex flex-wrap justify-between items-end mb-4 gap-2">
        <div>
          <div className="text-slate-400 font-bold">{nickname}</div>
          <div className="text-xs md:text-sm bg-slate-800 px-2 py-1 rounded text-brand-cyan inline-block mt-1">{category} • {difficulty}</div>
        </div>
        <div className="flex gap-4 md:gap-6 items-end text-right">
          <div>
            <div className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-1">Score</div>
            <div className="text-3xl md:text-4xl font-display font-bold text-white leading-none">{score}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-1">Streak</div>
            <div className="text-3xl md:text-4xl font-display font-bold text-brand-orange flex items-center leading-none gap-1">
              {streak} <span className="text-lg md:text-xl">🔥</span>
            </div>
            {combo > 1 && <div className="text-[10px] md:text-xs text-brand-pink font-bold mt-1">x{combo} COMBO</div>}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 md:h-4 bg-[#1E293B] rounded-full overflow-hidden mb-4 border border-slate-700">
        <motion.div 
          className={cn("h-full", timerColor)}
          initial={{ width: "100%" }}
          animate={{ width: `${timePercent}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Active Shield Indicator */}
      <AnimatePresence>
        {shieldActive && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-cyan/20 border border-brand-cyan text-brand-cyan px-4 py-2 rounded-full font-bold flex items-center gap-2"
          >
            <Shield size={18} /> Shield Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating PowerUp */}
      <AnimatePresence>
        {activePowerUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ y: { repeat: Infinity, duration: 1.5 } }}
            className="absolute z-50 left-1/2 -translate-x-1/2 top-1/4 cursor-pointer"
            onClick={handlePowerupClick}
          >
            <div className={cn(
              "p-4 rounded-full shadow-2xl border-2 flex items-center justify-center animate-pulse",
              activePowerUp.type === 'time' ? 'bg-brand-purple text-white border-white' : 'bg-brand-cyan text-slate-950 border-white'
            )}>
              {activePowerUp.type === 'time' ? <Clock size={32} /> : <Shield size={32} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Area */}
      <div className="bg-[#1E293B]/90 backdrop-blur-sm p-4 md:p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative flex flex-col justify-center">
        
        <div className="text-center">
          <div className={cn(
            "font-display font-bold mb-4 md:mb-8 transition-all",
            "text-5xl md:text-7xl lg:text-8xl text-white"
          )}>
            {question ? question.text : "Loading..."}
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="w-full max-w-[200px] md:max-w-[240px] text-center bg-[#0F172A] border-b-4 border-slate-700 pb-2 text-4xl md:text-5xl font-display font-bold text-brand-cyan min-h-[50px] md:min-h-[70px] flex items-center justify-center rounded-t-xl overflow-hidden">
              {inputValue || <span className="text-slate-600">?</span>}
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-[260px] md:max-w-[300px]">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', 'DEL'].map(key => (
                <button
                  key={key}
                  onClick={() => handleInputStr(key)}
                  className={cn(
                    "h-12 md:h-14 lg:h-16 rounded-2xl text-xl md:text-2xl font-display font-bold transition-all active:scale-95",
                    key === 'DEL' ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" :
                    key === '-' ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700" :
                    "bg-[#0F172A] border-2 border-slate-700 text-white hover:border-[#A855F7] shadow-lg"
                  )}
                >
                  {key === 'DEL' ? '⌫' : key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
