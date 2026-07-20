export function getTitle(score: number): string {
  if (score <= 10) return "Pemula (Noob)";
  if (score <= 20) return "Amatir";
  if (score <= 30) return "Jagoan Kelas";
  if (score <= 40) return "Si Otak Cepat";
  if (score <= 50) return "Master Hitung";
  if (score <= 60) return "Legend";
  if (score <= 70) return "Mythic";
  if (score <= 80) return "Kalkulator Berjalan";
  if (score <= 90) return "Einstein Muda";
  if (score <= 100) return "Dewa Matematika";
  return "Hacker Matematika";
}
