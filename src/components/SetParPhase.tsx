import React from "react";
import { Flag, ChevronRight } from "lucide-react";
import { NUM_HOLES } from "../utils/constants";

// Define the type for the props of SetParPhase component
interface SetParPhaseProps {
  parInputGrid: number[];
  setParInputGrid: React.Dispatch<React.SetStateAction<number[]>>;
  handleSubmitAllPars: () => void;
}

// Component for setting par values for all holes
const SetParPhase: React.FC<SetParPhaseProps> = ({
  parInputGrid,
  setParInputGrid,
  handleSubmitAllPars,
}) => {
  // Handles changes to individual par input fields in the grid
  const handleParInputChange = (holeIndex: number, value: string): void => {
    const par = parseInt(value); // Parse input value to an integer
    setParInputGrid((prevGrid) => {
      const newGrid = [...prevGrid]; // Create a shallow copy of the grid
      // Update the par value for the specific hole; ensure it's a positive number or 0
      newGrid[holeIndex] = isNaN(par) || par <= 0 ? 0 : par;
      return newGrid; // Return the updated grid
    });
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-br from-green-300 to-blue-400 font-inter text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-6xl md:max-w-4xl lg:max-w-6xl text-center mb-8">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center justify-center">
          <Flag className="mr-3 w-8 h-8" /> Set Par for Each Hole
        </h2>
        <p className="text-gray-600 mb-6">
          Enter the par for each of the {NUM_HOLES} holes.
        </p>

        <div className="overflow-x-auto w-full mb-8">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Hole No.
                </th>
                {Array.from({ length: NUM_HOLES }).map((_, index) => (
                  <th
                    key={`par-header-hole-${index}`}
                    className="py-3 px-2 border-b text-center text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    H{index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border-b text-left font-medium text-gray-800 whitespace-nowrap">
                  Par
                </td>
                {Array.from({ length: NUM_HOLES }).map((_, index) => (
                  <td
                    key={`par-input-hole-${index}`}
                    className="py-2 px-1 border-b text-center text-sm"
                  >
                    <input
                      type="number" // Use type="number" for mobile numeric keyboard
                      value={parInputGrid[index] || ""} // Display current value
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleParInputChange(index, e.target.value)
                      } // Handle input changes
                      className="w-16 p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-green-500 focus:border-green-500 h-10"
                      min="1" // Minimum value for par is 1
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSubmitAllPars} // Call the submit handler from props
          className="bg-green-600 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 min-h-[44px]"
        >
          Submit Pars & Continue <ChevronRight className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SetParPhase;
