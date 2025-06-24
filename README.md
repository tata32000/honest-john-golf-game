# Honest John Golf Game

A fun, interactive web-based golf scoring application built with React and TypeScript, designed to simulate a unique "Honest John" golf game where certain holes are randomly assigned 'par' scores for all players.

## ✨ Features

- **Customizable Par Values:** Easily set par for all 18 holes using a convenient grid input.

- **Player Management:** Add multiple players to the game. New players' initial scores are automatically pre-filled with the course par.

- **Fast Score Entry:** Input initial scores for all players across all holes simultaneously via a responsive table.

- **Interactive Randomization:**

  - Choose the number of "Honest John" (randomized to par) holes.

  - "Roll the dice" one by one to randomly select individual holes.

  - See live updates of current scores and offsets for each player as holes are randomized.

- **Editable Results:** After randomization, view the final scores and offsets. Final scores can be edited directly in the results table, with a "Recalculate Totals" option to update sums and offsets.

- **Responsive Design:** Optimized for a smooth user experience on both mobile and desktop screens.

- **Type-Safe Codebase:** Developed with TypeScript for enhanced code quality, readability, and maintainability.

## 🛠️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/) (which includes npm) installed. It's recommended to use a Node.js version that supports Vite (e.g., Node.js 14.18+, 16+).

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tata32000/honest-john-golf-game.git
   cd honest-john-golf-game
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # Or if you prefer yarn:
   # yarn install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # Or if you prefer yarn:
   # yarn dev`
   ```

   Your application will typically be available at `http://localhost:5173`.
