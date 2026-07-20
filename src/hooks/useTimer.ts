import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  enabled: boolean;
}

export function useTimer({ initialTime, onTimeUp, enabled }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current!);
          // Instead of calling onTimeUp here directly in the state updater
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetTimer = useCallback((newTime?: number) => {
    stopTimer();
    setTimeLeft(newTime ?? initialTime);
    if (enabled) {
      startTimer();
    }
  }, [initialTime, startTimer, stopTimer, enabled]);

  useEffect(() => {
    if (enabled) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [enabled, startTimer, stopTimer]);

  return { timeLeft, setTimeLeft, resetTimer, stopTimer, startTimer };
}
