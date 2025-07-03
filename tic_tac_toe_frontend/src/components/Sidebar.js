import React from "react";

// PUBLIC_INTERFACE
export default function Sidebar({ user, game, moves, myMark, turn, winner }) {
  /**
   * Sidebar displaying user/game info, whose turn, and move history.
   */
  const accent = "#FFC107";
  const primary = "#2196F3";
  const secondary = "#4CAF50";
  return (
    <aside style={{
      background: "#fff",
      borderLeft: `4px solid ${primary}`,
      padding: "1.5rem",
      minWidth: 220,
      maxWidth: 340,
      borderRadius: "0 22px 22px 0",
      boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
      marginLeft: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "1.15rem",
        color: primary,
        marginBottom: 4
      }}>
        User: <span style={{color: secondary}}>{user?.username}</span>
      </div>
      <hr style={{width: "95%", margin: "0.5rem 0 1.4rem 0", border: "none", borderTop: `1.5px solid ${primary}11`}} />
      <div style={{marginBottom: 18}}>
        <div>Game: <strong>{game?.id}</strong></div>
        <div>You are: <span style={{color: myMark === "X" ? primary : secondary, fontWeight: 600}}>{myMark}</span></div>
        <div>
          Turn: <span style={{fontWeight: 600, color: turn === "X" ? primary : secondary}}>{turn}</span>
        </div>
        {winner && (
          <div style={{
            marginTop: 7,
            fontWeight: 700,
            color: winner === "draw" ? accent : (winner === "X" ? primary : secondary)
          }}>
            {winner === "draw" ? "Draw!" : `Winner: ${winner}`}
          </div>
        )}
      </div>
      {moves && (
        <>
          <div style={{fontWeight: 600, margin: "0.5rem 0 6px 0", color: "#444"}}>Move History</div>
          <ol style={{paddingLeft: "1.4em", margin: 0, fontSize: 15}}>
          {moves.map((mv, i) => (
            <li key={i}>
              {mv.player}: {mv.position !== undefined ? `(${Math.floor(mv.position / 3) + 1},${mv.position % 3 + 1})` : ""}
            </li>
          ))}
          </ol>
        </>
      )}
    </aside>
  );
}
