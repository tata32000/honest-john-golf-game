import React, { useState } from "react";
import { Dices, ChevronRight, Edit } from "lucide-react";
import { NUM_HOLES } from "../utils/constants";
import {
  calculateOffset,
  calculateTotalScore,
  calculateTotalOffset,
} from "../utils/gameCalculations";
import type { Hole, Player } from "../utils/types";

interface RandomizeHolesPhaseProps {
  numHolesToRandomize: number;
  setNumHolesToRandomize: React.Dispatch<React.SetStateAction<number>>;
  randomizedHoleIndices: Set<number>;
  handleRandomizeOneHole: () => void;
  setManualRandomizeHole: (holeIndex: number) => void;
  handleViewFinalResults: () => void;
  holes: Hole[];
  players: Player[];
}

const RandomizeHolesPhase: React.FC<RandomizeHolesPhaseProps> = ({
  numHolesToRandomize,
  setNumHolesToRandomize,
  randomizedHoleIndices,
  handleRandomizeOneHole,
  setManualRandomizeHole,
  handleViewFinalResults,
  holes,
  players,
}) => {
  const [manualHoleInput, setManualHoleInput] = useState<string>(""); // State for manual hole input
  const [manualRandomizeMessage, setManualRandomizeMessage] =
    useState<string>(""); // Feedback message

  // Handler for manually randomizing a specific hole
  const handleManualRandomizeHole = (): void => {
    const holeNumber = parseInt(manualHoleInput);

    // Validate input
    if (isNaN(holeNumber) || holeNumber < 1 || holeNumber > NUM_HOLES) {
      setManualRandomizeMessage(
        "Please enter a valid hole number between 1 and " + NUM_HOLES + "."
      );
      return;
    }

    const holeIndex = holeNumber - 1; // Convert to 0-based index

    if (randomizedHoleIndices.has(holeIndex)) {
      setManualRandomizeMessage(
        "Hole " + holeNumber + " is already randomized!"
      );
      return;
    }

    if (randomizedHoleIndices.size >= numHolesToRandomize) {
      setManualRandomizeMessage(
        "You have already randomized the set number of holes."
      );
      return;
    }

    setManualRandomizeHole(holeIndex);

    setManualRandomizeMessage("Hole " + holeNumber + " manually selected.");
    setManualHoleInput(""); // Clear input
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-br from-yellow-300 to-orange-400 font-inter text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-6xl md:max-w-4xl lg:max-w-6xl text-center mb-8">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-6 flex items-center justify-center">
          <Dices className="mr-3 w-8 h-8" /> Randomize "Honest John" Holes
        </h2>
        <p className="text-gray-600 mb-4">
          Choose how many holes will become 'par' for everyone, then randomize
          them one by one.
        </p>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <label
            htmlFor="numRandom"
            className="text-lg font-semibold text-gray-700"
          >
            Number of random holes:
          </label>
          <input
            id="numRandom"
            type="number" // Use type="number" for mobile numeric keyboard
            value={numHolesToRandomize} // Controlled component value
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = parseInt(e.target.value);
              // Ensure value is a number, non-negative, and not more than total holes
              setNumHolesToRandomize(
                isNaN(val) || val < 0 || val > NUM_HOLES ? 0 : val
              );
            }}
            className="w-20 p-2 border border-gray-300 rounded-md text-lg text-center focus:ring-orange-500 focus:border-orange-500 transition duration-200 h-10"
            min="0" // Minimum random holes is 0
            max={NUM_HOLES} // Maximum random holes is total number of holes
          />
        </div>

        {/* Section for Manual Hole Randomization */}
        <div className="mt-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
          <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center justify-center">
            <Edit className="mr-2 w-6 h-6" /> Manually Select a Hole
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="number"
              value={manualHoleInput}
              onChange={(e) => {
                setManualHoleInput(e.target.value);
                setManualRandomizeMessage(""); // Clear message on input change
              }}
              placeholder="Hole Number (1-18)"
              className="w-40 p-2 border border-blue-300 rounded-md text-center text-base focus:ring-blue-500 focus:border-blue-500 h-10"
              min="1"
              max={NUM_HOLES}
            />
            <button
              onClick={handleManualRandomizeHole}
              className="py-2 px-6 rounded-lg text-lg font-semibold shadow-md transition duration-300 ease-in-out transform bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[44px]"
            >
              Manual Randomize
            </button>
          </div>
          {manualRandomizeMessage && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {manualRandomizeMessage}
            </p>
          )}
        </div>
        {/* End Manual Hole Randomization Section */}

        <button
          onClick={handleRandomizeOneHole} // Call handler to randomize one hole
          // Disable if enough holes are randomized or all holes are randomized
          disabled={
            randomizedHoleIndices.size >= numHolesToRandomize ||
            randomizedHoleIndices.size === NUM_HOLES
          }
          className={`mt-6 py-3 px-6 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform ${
            randomizedHoleIndices.size >= numHolesToRandomize ||
            randomizedHoleIndices.size === NUM_HOLES
              ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Disabled style
              : "bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300" // Enabled style
          } min-h-[44px]`}
        >
          Roll Dice & Randomize Another Hole ({randomizedHoleIndices.size} /{" "}
          {numHolesToRandomize})
        </button>

        {randomizedHoleIndices.size > 0 && ( // Conditionally render randomized holes display
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Randomized Holes:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {/* Display sorted list of randomized holes with their par values */}
              {Array.from(randomizedHoleIndices)
                .sort((a, b) => a - b)
                .map((index) => (
                  <span
                    key={`random-hole-display-${index}`}
                    className="bg-yellow-100 text-yellow-800 text-lg font-semibold px-4 py-2 rounded-full shadow-md"
                  >
                    Hole {index + 1} (Par {holes[index]?.par})
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Display current scores in a table, updating live as holes are randomized */}
        <div className="overflow-x-auto w-full mt-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Current Scores:
          </h3>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Player
                </th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">
                  Qualify Score
                </th>{" "}
                {/* Added Qualify Score header */}
                {holes.map((hole, index) => (
                  <th
                    key={`random-header-hole-${index}`}
                    className="py-3 px-2 border-b text-center text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    H{index + 1}
                    <br />
                    <span
                      className={
                        hole.isRandomPar
                          ? "text-red-600 text-xs"
                          : "text-green-600 text-xs"
                      }
                    >
                      (P: {hole.par}
                      {hole.isRandomPar ? "🎲" : ""})
                    </span>
                  </th>
                ))}
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">
                  Current Total
                </th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">
                  Total Offset
                </th>{" "}
                {/* New column for Total Offset */}
              </tr>
            </thead>
            <tbody>
              {players.map((player, pIndex) => (
                <tr
                  key={`random-player-row-${pIndex}`}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-3 px-4 border-b text-left font-medium text-gray-800 whitespace-nowrap">
                    {pIndex + 1}. {player.name}
                    <br />
                    <span
                      className={`text-xs ${
                        calculateTotalOffset(player, holes) > 0
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      ({calculateOffset(calculateTotalOffset(player, holes), 0)}
                      )
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-center text-sm">
                    <span className="font-semibold text-gray-700">
                      {player.qualifyScore}
                    </span>{" "}
                    {/* Display Qualify Score */}
                  </td>
                  {holes.map((hole, hIndex) => (
                    <td
                      key={`random-player-${pIndex}-hole-${hIndex}`}
                      className="py-3 px-2 border-b text-center text-sm"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-semibold ${
                            hole.isRandomPar
                              ? "text-orange-700"
                              : "text-indigo-700"
                          } text-base`}
                        >
                          {player.finalScores[hIndex]}{" "}
                          {/* Display the current final score */}
                        </span>
                        {/* Display offset for each hole */}
                        <span
                          className={`text-xs ${
                            parseInt(
                              calculateOffset(
                                player.finalScores[hIndex],
                                hole.par
                              )
                            ) > 0
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          (
                          {calculateOffset(
                            player.finalScores[hIndex],
                            hole.par
                          )}
                          )
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-4 border-b text-center font-bold text-lg text-purple-700 whitespace-nowrap">
                    {calculateTotalScore(player.finalScores)}{" "}
                    {/* Display total score */}
                  </td>
                  <td className="py-3 px-4 border-b text-center font-bold text-lg whitespace-nowrap">
                    <span
                      className={`${
                        calculateTotalOffset(player, holes) > 0
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {calculateOffset(calculateTotalOffset(player, holes), 0)}{" "}
                      {/* Display total offset */}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleViewFinalResults} // Call handler to view final results
            disabled={randomizedHoleIndices.size < numHolesToRandomize} // Disable until enough holes are randomized
            className={`py-3 px-8 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform ${
              randomizedHoleIndices.size < numHolesToRandomize
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            } min-h-[44px]`}
          >
            View Final Results <ChevronRight className="inline-block ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomizeHolesPhase;
