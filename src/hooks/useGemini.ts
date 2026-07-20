import { useState, useCallback } from 'react';
import { MathQuestion, Category, Difficulty } from '../types';

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const getBossQuestion = useCallback(async (category: Category, difficulty: Difficulty): Promise<MathQuestion | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/boss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty })
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      return {
        text: data.question,
        answer: data.answer,
        operation: "boss",
        isBoss: true
      };
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHint = useCallback(async (questionText: string): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText })
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      return data.hint;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMotivation = useCallback(async (score: number, title: string, worstCategory: string): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, title, worstCategory })
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      return data.motivation;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getBossQuestion, getHint, getMotivation, loading };
}
