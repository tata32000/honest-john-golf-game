import type { Player, Hole } from "./types";

// Calculates the offset (difference from par) for a given score on a single hole.
// This function still uses 'par' as it's the standard for individual hole performance.
export const calculateOffset = (score: number, par: number): string => {
  const offset = score - par; // Calculate the difference
  return offset > 0 ? `+${offset}` : offset.toString(); // Return with '+' if positive, otherwise as string
};

// Calculates the total score for an array of scores
export const calculateTotalScore = (scores: number[]): number => {
  // Sum all scores in the array
  return scores.reduce((sum, score) => sum + score, 0);
};

// Calculates the total offset for a player across all holes,
// now factoring in their 'qualifyScore' (which acts like a handicap).
export const calculateTotalOffset = (
  player: Player,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _holes: Hole[]
): number => {
  // First, get the player's total raw score across all final scores
  const totalRawScore = calculateTotalScore(player.finalScores);

  // Then, subtract the player's qualifyScore from their total raw score
  // This treats the qualifyScore as a handicap applied to the final total.
  const totalOffset = totalRawScore - player.qualifyScore;

  return totalOffset;
};
