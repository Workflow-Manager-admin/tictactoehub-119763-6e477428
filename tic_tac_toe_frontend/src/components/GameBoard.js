import React from "react";

// PUBLIC_INTERFACE
export default function GameBoard({ board, myMark, onMove, active, winner, lastMove, disabled }) {
  /**
   * Render the tic-tac-toe board
   * board: Array of 9 slots (["X", "O", null, ...])
   * myMark: "X" or "O"
   * onMove(position) called on move
   * active: bool, if it's the player's turn
   * winner: "X", "O", or "draw"
   * lastMove: int (0-8) for highlighting last move
   * disabled: disables board interaction
   */
  const getCellColor = idx => {
    if (winner && winner !== "draw" && board[idx] === winner)
      return "#4CAF50";
    if (idx === lastMove)
      return "#FFC107";
    return "#fff";
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 70px)",
      gridTemplateRows: "repeat(3, 70px)",
      gap: 7,
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem auto",
      background: "#e3f0fa",
      padding: 14,
      borderRadius: 15,
      boxShadow: "0 2px 12px rgba(33,150,243,0.10)"
    }}>
      {Array(9).fill(null).map((_, idx) => (
        <button
          key={idx}
          disabled={!!board[idx] || !!winner || !active || disabled}
          onClick={() => onMove(idx)}
          aria-label={`Board position ${idx}`}
          style={{
            width: 70, height: 70,
            fontSize: "2.5rem", fontWeight: "700",
            border: "2px solid #2196F3",
            background: getCellColor(idx),
            color: board[idx] === "X" ? "#2196F3" : board[idx] === "O" ? "#4CAF50" : "#888",
            cursor: !!board[idx] || !!winner || !active || disabled ? "default" : "pointer",
            borderRadius: 9,
            outline: "none",
            transition: "background 0.2s"
          }}
        >
          {board[idx]}
        </button>
      ))}
    </div>
  );
}
