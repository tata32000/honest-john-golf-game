import React from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { NUM_HOLES } from "../utils/constants";
import type { Player, Hole } from "../utils/types";

// Define the type for the props of EnterScoresPhase component
interface EnterScoresPhaseProps {
  players: Player[];
  holes: Hole[];
  initialScoresGrid: number[][];
  setInitialScoresGrid: React.Dispatch<React.SetStateAction<number[][]>>;
  handleSubmitAllInitialScores: () => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>; // Add setPlayers to props
}

// Component for entering initial scores for all players and holes
const EnterScoresPhase: React.FC<EnterScoresPhaseProps> = ({
  players,
  holes,
  initialScoresGrid,
  setInitialScoresGrid,
  handleSubmitAllInitialScores,
  setPlayers, // Destructure setPlayers from props
}) => {
  // Handles changes to individual score input fields in the grid
  const handleScoreInputChange = (
    pIndex: number,
    hIndex: number,
    value: string
  ): void => {
    const score = parseInt(value); // Parse input value to an integer
    setInitialScoresGrid((prevGrid) => {
      const newGrid = [...prevGrid]; // Create a shallow copy of the grid
      // Ensure the row for the player exists, then update the score for the specific hole
      if (!newGrid[pIndex]) newGrid[pIndex] = Array(NUM_HOLES).fill(0);
      newGrid[pIndex][hIndex] = isNaN(score) || score <= 0 ? 0 : score; // Store positive number or 0
      return newGrid; // Return the updated grid
    });
  };

  // Handles changes to the qualify score input field
  const handleQualifyScoreChange = (pIndex: number, value: string): void => {
    const score = parseInt(value);
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      if (updatedPlayers[pIndex]) {
        updatedPlayers[pIndex] = {
          ...updatedPlayers[pIndex],
          qualifyScore: isNaN(score) || score < 0 ? 0 : score, // Ensure score is non-negative
        };
      }
      return updatedPlayers;
    });
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-br from-purple-300 to-pink-400 font-inter text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-6xl md:max-w-4xl lg:max-w-6xl text-center mb-8">
        <h2 className="text-3xl font-extrabold text-pink-700 mb-6 flex items-center justify-center">
          <Trophy className="mr-3 w-8 h-8" /> Enter Initial Scores
        </h2>
        <p className="text-gray-600 mb-6">
          Enter each player's initial score for all {NUM_HOLES} holes.
        </p>

        <div className="overflow-x-auto w-full mb-8">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Player
                </th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Qualify Score
                </th>{" "}
                {/* New header for Qualify Score */}
                {holes.map((hole, index) => (
                  <th
                    key={`header-hole-${index}`}
                    className="py-3 px-2 border-b text-center text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    H{index + 1}
                    <br />
                    <span className="text-green-600 text-xs">
                      (P: {hole.par})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((player, pIndex) => (
                <tr
                  key={`player-score-row-${pIndex}`}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-3 px-4 border-b text-left font-medium text-gray-800 whitespace-nowrap">
                    {pIndex + 1}. {player.name}
                  </td>
                  <td className="py-2 px-1 border-b text-center text-sm">
                    <input
                      type="number"
                      value={player.qualifyScore || ""} // Display qualify score
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleQualifyScoreChange(pIndex, e.target.value)
                      }
                      className="w-20 p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-purple-500 focus:border-purple-500 h-10"
                      min="0" // Qualify score can be 0 or positive
                    />
                  </td>{" "}
                  {/* New cell for Qualify Score input */}
                  {holes.map((_hole, hIndex) => (
                    <td
                      key={`player-${pIndex}-hole-${hIndex}-score-input`}
                      className="py-2 px-1 border-b text-center text-sm"
                    >
                      <input
                        type="number" // Use type="number" for mobile numeric keyboard
                        value={initialScoresGrid[pIndex]?.[hIndex] || ""} // Display current value
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleScoreInputChange(pIndex, hIndex, e.target.value)
                        } // Handle input changes
                        className="w-16 p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-purple-500 focus:border-purple-500 h-10"
                        min="1" // Minimum value for score is 1
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSubmitAllInitialScores} // Call the submit handler from props
          className="bg-purple-600 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 min-h-[44px]"
        >
          Submit All Scores <ChevronRight className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default EnterScoresPhase;
