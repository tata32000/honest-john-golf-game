import React, { useState, useEffect, useCallback } from "react";

import SetParPhase from "./components/SetParPhase";
import AddPlayersPhase from "./components/AddPlayersPhase";
import EnterScoresPhase from "./components/EnterScoresPhase";
import RandomizeHolesPhase from "./components/RandomizeHolesPhase";
import ResultsPhase from "./components/ResultsPhase";

import {
  getDefaultPars,
  NUM_HOLES,
  DEFAULT_RANDOM_HOLES,
} from "./utils/constants";
import type { Hole, Player } from "./utils/types";

const App: React.FC = () => {
  // State to manage the current phase of the game
  const [gamePhase, setGamePhase] = useState<string>("settingPar");

  // State to store par for each of the 18 holes, and whether it's a 'random par' hole
  const [holes, setHoles] = useState<Hole[]>(
    Array(NUM_HOLES).fill({ par: 0, isRandomPar: false })
  );
  // State for the input grid used to set all par values at once
  const [parInputGrid, setParInputGrid] = useState<number[]>(getDefaultPars());

  // State to store players, including their names, initial scores, and final scores
  const [players, setPlayers] = useState<Player[]>([]);
  // State for the input field to add new player names
  const [newPlayerName, setNewPlayerName] = useState<string>("");

  // State for the grid of initial scores entered by players
  const [initialScoresGrid, setInitialScoresGrid] = useState<number[][]>([]);

  // State for the number of holes the user wants to randomize to par
  const [numHolesToRandomize, setNumHolesToRandomize] =
    useState<number>(DEFAULT_RANDOM_HOLES);
  // State to store the indices of holes that have been randomly selected to become par
  const [randomizedHoleIndices, setRandomizedHoleIndices] = useState<
    Set<number>
  >(new Set());

  // Helper function: Calculates players' final scores based on initial scores and randomized holes
  // Memoized with useCallback to prevent unnecessary re-creation, optimizing performance.
  const calculateCurrentFinalScores = useCallback(
    (currentPlayers: Player[], currentHoles: Hole[]): Player[] => {
      return currentPlayers.map((player) => {
        const finalScores = player.initialScores.map((score, index) => {
          // If the current hole is a random par hole, use its par value; otherwise, use the player's initial score
          return currentHoles[index].isRandomPar
            ? currentHoles[index].par
            : score;
        });
        return { ...player, finalScores: finalScores }; // Return player object with updated finalScores
      });
    },
    []
  ); // No dependencies as it uses arguments directly

  // Effect hook: Recalculates and updates players' final scores whenever the 'holes' state changes
  // This is crucial for the 'randomizingHoles' phase to show live updates after each dice roll.
  useEffect(() => {
    if (gamePhase === "randomizingHoles") {
      setPlayers((prevPlayers) => {
        // Calculate updated final scores based on the previous players state and the current holes configuration
        const updatedPlayers = calculateCurrentFinalScores(prevPlayers, holes);

        // Perform a deep equality check on the finalScores to prevent unnecessary state updates
        // and potential infinite re-renders if the calculated scores are identical.
        const currentFinalScoresString = JSON.stringify(
          prevPlayers.map((p) => p.finalScores)
        );
        const newFinalScoresString = JSON.stringify(
          updatedPlayers.map((p) => p.finalScores)
        );

        if (currentFinalScoresString !== newFinalScoresString) {
          return updatedPlayers; // Return new state only if scores have actually changed
        }
        return prevPlayers; // Otherwise, return previous state to avoid re-render
      });
    }
  }, [holes, gamePhase, calculateCurrentFinalScores]); // Dependencies: re-run when 'holes' or 'gamePhase' changes

  // Effect hook: Synchronizes `initialScoresGrid` with the `players` state.
  // Ensures the input grid is correctly populated when players are added or removed,
  // preserving existing scores where applicable and pre-filling new players' scores.
  useEffect(() => {
    setInitialScoresGrid((prevGrid) => {
      const newGrid = players.map((player, pIndex) => {
        // If a player at this index already has scores in the previous grid, use them.
        // Otherwise, use the initial scores from the `player` object (which are pre-populated with par for new players).
        return prevGrid[pIndex] && prevGrid[pIndex].length === NUM_HOLES
          ? prevGrid[pIndex]
          : player.initialScores;
      });
      return newGrid;
    });
  }, [players]); // Dependency: re-run when 'players' state changes

  // --- Functions for Game Progression (Handlers passed to child components) ---

  // Handles submitting all par values entered in the grid
  const handleSubmitAllPars = (): void => {
    // Update the 'holes' state with the new par values from the input grid
    const updatedHoles: Hole[] = holes.map((hole, index) => ({
      ...hole,
      par: parInputGrid[index] || 0, // Ensure par is at least 0 if input is empty
    }));
    setHoles(updatedHoles);
    setGamePhase("addingPlayers"); // Move to the next phase
  };

  // Handles adding a new player to the game
  const handleAddPlayer = (): void => {
    if (newPlayerName.trim() !== "") {
      // Pre-populate new player's initial scores with the current par for each hole
      const newPlayerInitialScores: number[] = holes.map((hole) => hole.par);

      // Add the new player object to the 'players' state
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          name: newPlayerName.trim(),
          initialScores: newPlayerInitialScores,
          finalScores: [...newPlayerInitialScores], // Initially, final scores are same as initial scores
          qualifyScore: 0, // Initialize new qualify score to 0
        },
      ]);

      // Also update the `initialScoresGrid` to reflect the new player's pre-populated scores
      setInitialScoresGrid((prevGrid) => [
        ...prevGrid,
        [...newPlayerInitialScores],
      ]);

      setNewPlayerName(""); // Clear the input field
    } else {
      console.error("Please enter a player name."); // Log error instead of alert
    }
  };

  // Transitions the game to the initial score entry phase
  const handleStartInitialScoreEntry = (): void => {
    if (players.length > 0) {
      setGamePhase("enteringScores");
    } else {
      console.error("Please add at least one player before entering scores."); // Log error
    }
  };

  // Handles submitting all initial scores entered in the grid
  const handleSubmitAllInitialScores = (): void => {
    // Update each player's 'initialScores' with the values from the `initialScoresGrid`
    const updatedPlayers: Player[] = players.map((player, pIndex) => ({
      ...player,
      initialScores: initialScoresGrid[pIndex],
    }));
    setPlayers(updatedPlayers);
    setGamePhase("randomizingHoles"); // Move to the randomization phase
  };

  // Handles randomizing a single hole to become 'par'
  const handleRandomizeOneHole = (): void => {
    // Check if there are still holes to randomize and if not all holes are already randomized
    if (
      randomizedHoleIndices.size < numHolesToRandomize &&
      randomizedHoleIndices.size < NUM_HOLES
    ) {
      let randomIndex: number;
      // Loop until a unique, unrandomized hole is found
      do {
        randomIndex = Math.floor(Math.random() * NUM_HOLES);
      } while (randomizedHoleIndices.has(randomIndex));

      // Add the newly randomized hole's index to the set
      const newRandomizedHoleIndices: Set<number> = new Set(
        randomizedHoleIndices
      );
      newRandomizedHoleIndices.add(randomIndex);
      setRandomizedHoleIndices(newRandomizedHoleIndices);

      // Mark the selected hole as a 'random par' hole in the 'holes' state
      setHoles((prevHoles) => {
        const updatedHoles = [...prevHoles];
        updatedHoles[randomIndex] = {
          ...updatedHoles[randomIndex],
          isRandomPar: true,
        };
        return updatedHoles;
      });

      // The `useEffect` hook will automatically recalculate `finalScores` and update the display.
    } else {
      console.warn(
        "All selected holes have been randomized or all 18 holes are randomized."
      ); // Log warning
    }
  };

  const setManualRandomizeHole = (holeIndex: number): void => {
    // Convert the manual input to a number, defaulting to 0 if invalid
    const parsedPar = parInputGrid[holeIndex] || 0;

    // Update the specific hole's par value and mark it as a random par hole
    setHoles((prevHoles) => {
      const updatedHoles = [...prevHoles];
      updatedHoles[holeIndex] = {
        ...updatedHoles[holeIndex],
        par: parsedPar,
        isRandomPar: true, // Mark this hole as a random par hole
      };
      return updatedHoles;
    });

    // Add this hole index to the set of randomized holes
    setRandomizedHoleIndices((prevIndices) => {
      const newIndices = new Set(prevIndices);
      newIndices.add(holeIndex);
      return newIndices;
    });

    console.log(
      `Hole ${
        holeIndex + 1
      } manually set to par ${parsedPar} and marked as random.`
    );
  };

  // Function to transition to the final results phase
  const handleViewFinalResults = (): void => {
    // Ensure final scores are calculated one last time before displaying results
    const finalPlayers: Player[] = calculateCurrentFinalScores(players, holes);
    setPlayers(finalPlayers);
    setGamePhase("results"); // Move to the results phase
  };

  // Handles changes to a player's final score in the results table (for manual editing)
  const handleFinalScoreChange = (
    playerIndex: number,
    holeIndex: number,
    value: string
  ): void => {
    const score = parseInt(value);
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      // Update the specific final score, ensuring it's a positive number or 0
      updatedPlayers[playerIndex].finalScores[holeIndex] =
        isNaN(score) || score <= 0 ? 0 : score;
      return updatedPlayers;
    });
  };

  // Recalculates total scores and offsets based on current final scores (after manual edits)
  const handleRecalculateTotals = (): void => {
    // By creating a shallow copy of the 'players' array, React re-renders components
    // that depend on it, effectively recalculating all derived totals and offsets.
    setPlayers([...players]);
  };

  // --- Main Render Logic: Renders the appropriate phase component based on `gamePhase` ---
  return (
    <div className="app-container">
      {gamePhase === "settingPar" && (
        <SetParPhase
          parInputGrid={parInputGrid}
          setParInputGrid={setParInputGrid}
          handleSubmitAllPars={handleSubmitAllPars}
        />
      )}
      {gamePhase === "addingPlayers" && (
        <AddPlayersPhase
          players={players}
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          handleAddPlayer={handleAddPlayer}
          handleStartInitialScoreEntry={handleStartInitialScoreEntry}
        />
      )}
      {gamePhase === "enteringScores" && (
        <EnterScoresPhase
          players={players}
          holes={holes}
          initialScoresGrid={initialScoresGrid}
          setInitialScoresGrid={setInitialScoresGrid}
          handleSubmitAllInitialScores={handleSubmitAllInitialScores}
          setPlayers={setPlayers} // Pass setPlayers to EnterScoresPhase for qualifyScore updates
        />
      )}
      {gamePhase === "randomizingHoles" && (
        <RandomizeHolesPhase
          numHolesToRandomize={numHolesToRandomize}
          setNumHolesToRandomize={setNumHolesToRandomize}
          randomizedHoleIndices={randomizedHoleIndices}
          handleRandomizeOneHole={handleRandomizeOneHole}
          setManualRandomizeHole={setManualRandomizeHole}
          handleViewFinalResults={handleViewFinalResults}
          holes={holes}
          players={players}
        />
      )}
      {gamePhase === "results" && (
        <ResultsPhase
          players={players}
          holes={holes}
          handleFinalScoreChange={handleFinalScoreChange}
          handleRecalculateTotals={handleRecalculateTotals}
        />
      )}
    </div>
  );
};

export default App;
