import { Category, Difficulty, MathQuestion } from '../types';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateLocalQuestion(category: Category, difficulty: Difficulty): MathQuestion {
  let min = 1, max = 10;
  
  if (difficulty === "Mudah") {
    min = 1; max = 10;
  } else if (difficulty === "Sedang") {
    min = 10; max = 50;
  } else if (difficulty === "Sulit") {
    min = 20; max = 100;
  }

  const getOp = (cat: Category): string => {
    if (cat === "Penjumlahan") return "+";
    if (cat === "Pengurangan") return "-";
    if (cat === "Perkalian") return "*";
    if (cat === "Pembagian") return "/";
    if (cat === "Mix 1") return Math.random() > 0.5 ? "+" : "-";
    if (cat === "Mix 2") return Math.random() > 0.5 ? "*" : "/";
    if (cat === "Mix 3") {
      const ops = ["+", "-", "*", "/"];
      return ops[Math.floor(Math.random() * ops.length)];
    }
    return "+";
  };

  const op = getOp(category);
  let num1 = getRandomInt(min, max);
  let num2 = getRandomInt(min, max);

  // Adjust for multiplication to not be too crazy
  if (op === "*" && difficulty !== "Sulit") {
    max = difficulty === "Mudah" ? 10 : 20;
    num1 = getRandomInt(2, max);
    num2 = getRandomInt(2, max);
  }

  // Ensure division is whole number
  if (op === "/") {
    num2 = getRandomInt(2, difficulty === "Mudah" ? 10 : 20);
    const answer = getRandomInt(2, difficulty === "Mudah" ? 10 : 20);
    num1 = num2 * answer;
  }

  // Ensure subtraction is non-negative
  if (op === "-" && num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  let answer = 0;
  let opText = "";
  switch (op) {
    case "+": answer = num1 + num2; opText = "+"; break;
    case "-": answer = num1 - num2; opText = "-"; break;
    case "*": answer = num1 * num2; opText = "×"; break;
    case "/": answer = num1 / num2; opText = "÷"; break;
  }

  return {
    text: `${num1} ${opText} ${num2} = ?`,
    answer,
    operation: op
  };
}
