import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

function deriveActivePlayer(gameTurns) {
  let activePlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    activePlayer = "O";
  }

  return activePlayer;
}

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  let winner, draw;
  let gameBoard = initialGameBoard;

  gameTurns.forEach(turn => {
    const { player, square } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  });

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].col];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].col];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].col];

    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = firstSquareSymbol;
    } else if (gameTurns.length === 9) {
      draw = true;
    }
  }

  const handlePlayerTurn = (rowIndex, colIndex) => {
    setGameTurns(previousGameTurns => {
      const currentPlayer = deriveActivePlayer(previousGameTurns);
      const updatedTurns = [{ player: currentPlayer, square: { row: rowIndex, col: colIndex } }, ...previousGameTurns];
      return updatedTurns;
    });
  };

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player 1" symbol="X" isActive={activePlayer === "X"} />
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === "O"} />
        </ol>
        {(winner || draw) && <GameOver winner={winner} />}
        <GameBoard onPlayerTurn={handlePlayerTurn} turns={gameTurns} board={gameBoard} />
      </div>
      <Log gameTurns={gameTurns} />
    </main>
  );
}

export default App;
