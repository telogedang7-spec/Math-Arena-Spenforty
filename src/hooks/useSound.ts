import { useCallback, useRef } from 'react';

export function useSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
    if (!enabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [enabled, initAudio]);

  const playCorrect = useCallback(() => {
    playTone(600, 'sine', 0.1, 0.2);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.2), 100);
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(300, 'sawtooth', 0.3, 0.3);
    setTimeout(() => playTone(200, 'sawtooth', 0.4, 0.3), 150);
  }, [playTone]);

  const playPowerup = useCallback(() => {
    playTone(400, 'square', 0.1, 0.1);
    setTimeout(() => playTone(600, 'square', 0.1, 0.1), 100);
    setTimeout(() => playTone(800, 'square', 0.2, 0.1), 200);
  }, [playTone]);

  const playBoss = useCallback(() => {
    playTone(150, 'sawtooth', 1.0, 0.4);
    setTimeout(() => playTone(100, 'sawtooth', 1.5, 0.4), 500);
  }, [playTone]);

  return { playCorrect, playWrong, playPowerup, playBoss, initAudio };
}
