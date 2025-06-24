import React from "react";
import { Dices } from "lucide-react";
import {
  calculateOffset,
  calculateTotalScore,
  calculateTotalOffset,
} from "../utils/gameCalculations";
import { NUM_HOLES } from "../utils/constants";
import type { Hole, Player } from "../utils/types";

// Define the type for the props of ResultsPhase component
interface ResultsPhaseProps {
  players: Player[];
  holes: Hole[];
  handleFinalScoreChange: (
    playerIndex: number,
    holeIndex: number,
    value: string
  ) => void;
  handleRecalculateTotals: () => void;
}

// Component for displaying the final results
const ResultsPhase: React.FC<ResultsPhaseProps> = ({
  players,
  holes,
  handleFinalScoreChange,
  handleRecalculateTotals,
}) => {
  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-br from-blue-300 to-indigo-500 font-inter text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-6xl md:max-w-4xl lg:max-w-6xl text-center mb-8">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 flex items-center justify-center">
          <Dices className="mr-3 w-9 h-9" /> Honest John Golf Results!
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          The following holes were randomized to become par:
          <br />
          <span className="font-semibold text-green-600">
            {/* Display list of randomized holes */}
            {holes
              .filter((h) => h.isRandomPar)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .map((h, _idx) => `Hole ${holes.indexOf(h) + 1} (Par ${h.par})`)
              .join(", ") || "None"}
          </span>
        </p>
        <p className="text-gray-600 text-md mb-8 italic">
          You can edit the "Final" scores directly in the table below. Click
          "Recalculate Totals" to update totals and offsets.
        </p>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Player
                </th>
                {Array.from({ length: NUM_HOLES }).map((_, index) => (
                  <th
                    key={`header-hole-${index}`}
                    className="py-3 px-2 border-b text-center text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    H{index + 1}
                    <br />
                    <span className="text-green-600 text-xs">
                      (P: {holes[index]?.par}
                      {holes[index]?.isRandomPar ? "🎲" : ""})
                    </span>{" "}
                    {/* Show dice emoji if randomized */}
                  </th>
                ))}
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">
                  Total Score
                </th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">
                  Total Offset
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, pIndex) => (
                <tr
                  key={`player-row-${pIndex}`}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-3 px-4 border-b text-left font-medium text-gray-800 whitespace-nowrap">
                    {player.name}
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
                  {Array.from({ length: NUM_HOLES }).map((_, hIndex) => (
                    <td
                      key={`player-${pIndex}-hole-${hIndex}`}
                      className="py-3 px-2 border-b text-center text-sm"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-gray-600 text-xs">
                          Initial: {player.initialScores[hIndex]}
                        </span>
                        <input
                          type="number" // Allow editing of final scores
                          value={player.finalScores[hIndex] || ""} // Display current final score
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFinalScoreChange(
                              pIndex,
                              hIndex,
                              e.target.value
                            )
                          } // Handle input changes
                          className="w-16 p-2 mt-1 border border-gray-300 rounded-md text-center text-base font-semibold text-indigo-700 focus:ring-indigo-500 focus:border-indigo-500 h-10"
                          min="1" // Minimum score is 1
                        />
                        <span
                          className={`text-xs ${
                            parseInt(
                              calculateOffset(
                                player.finalScores[hIndex],
                                holes[hIndex]?.par
                              )
                            ) > 0
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          (
                          {calculateOffset(
                            player.finalScores[hIndex],
                            holes[hIndex]?.par
                          )}
                          )
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-4 border-b text-center font-bold text-lg text-purple-700 whitespace-nowrap">
                    {calculateTotalScore(player.finalScores)}{" "}
                    {/* Display total final score */}
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
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleRecalculateTotals} // Call handler to recalculate totals
            className="bg-green-600 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 min-h-[44px]"
          >
            Recalculate Totals
          </button>
          <button
            onClick={() => window.location.reload()} // Reload page to restart the game
            className="bg-pink-600 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 min-h-[44px]"
          >
            Play Again!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPhase;
