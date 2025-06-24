// utils/types.ts

// Defines the structure for a single golf hole
export interface Hole {
  par: number; // The par score for this hole
  isRandomPar: boolean; // Flag to indicate if this hole was randomized to par
}

// Defines the structure for a player in the golf game
export interface Player {
  name: string; // The name of the player
  initialScores: number[]; // Array of initial scores for each of the 18 holes
  finalScores: number[]; // Array of final scores after randomization for each of the 18 holes
}
