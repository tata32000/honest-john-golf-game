// utils/gameCalculations.ts

// utils/gameCalculations.ts
import type { Player, Hole } from "./types.ts"; // Corrected import path with .ts extension
// Corrected import path with .ts extension

// Calculates the offset (difference from par) for a given score
export const calculateOffset = (score: number, par: number): string => {
  const offset = score - par; // Calculate the difference
  return offset > 0 ? `+${offset}` : offset.toString(); // Return with '+' if positive, otherwise as string
};

// Calculates the total score for an array of scores
export const calculateTotalScore = (scores: number[]): number => {
  // Sum all scores in the array
  return scores.reduce((sum, score) => sum + score, 0);
};

// Calculates the total offset for a player across all holes
export const calculateTotalOffset = (player: Player, holes: Hole[]): number => {
  // Sum the individual offsets for each hole
  return player.finalScores.reduce(
    (sum, score, index) => sum + (score - holes[index].par),
    0
  );
};
