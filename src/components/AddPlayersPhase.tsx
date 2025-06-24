import React from 'react';
import { UserPlus, ChevronRight } from 'lucide-react';
import type { Player } from '../utils/types.ts'; // Corrected import path with .ts extension
 // Corrected import path with .ts extension

// Define the type for the props of AddPlayersPhase component
interface AddPlayersPhaseProps {
  players: Player[];
  newPlayerName: string;
  setNewPlayerName: React.Dispatch<React.SetStateAction<string>>;
  handleAddPlayer: () => void;
  handleStartInitialScoreEntry: () => void;
}

// Component for adding players to the game
const AddPlayersPhase: React.FC<AddPlayersPhaseProps> = ({ players, newPlayerName, setNewPlayerName, handleAddPlayer, handleStartInitialScoreEntry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-green-300 to-blue-400 font-inter text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center justify-center">
          <UserPlus className="mr-3 w-8 h-8" /> Add Players
        </h2>
        <p className="text-gray-600 mb-6">Enter names of players. You can add as many as you need!</p>
        <div className="flex flex-col sm:flex-row mb-6 space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text" // Input type for text (player name)
            value={newPlayerName} // Controlled component value
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)} // Update state on change
            placeholder="Player Name" // Placeholder text
            className="flex-grow p-3 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-12"
          />
          <button
            onClick={handleAddPlayer} // Call handler to add player
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-xl font-semibold shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[44px]"
          >
            Add
          </button>
        </div>

        {players.length > 0 && ( // Conditionally render player list if players exist
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Players:</h3>
            <ul className="text-lg text-gray-800 space-y-2">
              {players.map((player, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <span>{player.name}</span>
                  <span className="text-sm text-gray-500">({index + 1})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleStartInitialScoreEntry} // Call handler to start score entry
            disabled={players.length === 0} // Disable if no players are added
            className={`py-3 px-8 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform ${
              players.length === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' // Disabled style
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300' // Enabled style
            } min-h-[44px]`}
          >
            Start Entering Scores <ChevronRight className="inline-block ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayersPhase;
