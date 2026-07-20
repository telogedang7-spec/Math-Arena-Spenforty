import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Boss Question
  app.post("/api/boss", async (req, res) => {
    try {
      const { category, difficulty } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Buat 1 soal cerita (word problem) matematika dalam Bahasa Indonesia untuk siswa SMP.
Kategori: ${category}
Tingkat Kesulitan: ${difficulty}
Soal harus terdiri dari 2 langkah penyelesaian.
Berikan output dalam format JSON dengan key: "question" (string) dan "answer" (number). Jangan sertakan teks lain di luar JSON.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      res.json(result);
    } catch (error) {
      console.error("Error generating boss question:", error);
      res.status(500).json({ error: "Gagal membuat soal boss" });
    }
  });

  // API Route for Hint
  app.post("/api/hint", async (req, res) => {
    try {
      const { question } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Berikan petunjuk (hint) untuk menyelesaikan soal matematika berikut tanpa memberikan jawaban akhirnya.
Gunakan gaya bahasa santai dan suportif ala Gen Z. Maksimal 2 kalimat singkat.
Soal: ${question}`,
      });
      res.json({ hint: response.text });
    } catch (error) {
      console.error("Error generating hint:", error);
      res.status(500).json({ error: "Gagal membuat hint" });
    }
  });

  // API Route for Motivation
  app.post("/api/motivation", async (req, res) => {
    try {
      const { score, title, worstCategory } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Tulis pesan motivasi 1-2 kalimat untuk pemain game "Math Arena" yang baru selesai bermain.
Skor akhir: ${score}
Gelar: ${title}
Kategori yang paling sering salah: ${worstCategory || "tidak ada"}
Gunakan gaya bahasa Gen Z yang suportif dan asik.`,
      });
      res.json({ motivation: response.text });
    } catch (error) {
      console.error("Error generating motivation:", error);
      res.status(500).json({ error: "Gagal membuat motivasi" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
