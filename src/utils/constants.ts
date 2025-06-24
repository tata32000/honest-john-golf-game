// utils/constants.ts

// Define the total number of holes in the golf game
export const NUM_HOLES: number = 18;
// Define the default number of holes to be randomized (dice rolls)
export const DEFAULT_RANDOM_HOLES: number = 3;

// Function to generate default par values for all holes
export const getDefaultPars = (): number[] => {
  return Array(NUM_HOLES)
    .fill(0)
    .map((_, i) => {
      // Assign example par values: some holes are par 3, some par 5, others par 4
      if (i === 0 || i === 4 || i === 8 || i === 12 || i === 16) return 3; // Par 3 holes
      if (i === 2 || i === 6 || i === 10 || i === 14) return 5; // Par 5 holes
      return 4; // Default par 4 for all other holes
    });
};
