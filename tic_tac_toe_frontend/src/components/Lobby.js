import React, { useEffect, useState } from "react";
import { fetchGames, createGame, joinGame } from "../api";

// PUBLIC_INTERFACE
export default function Lobby({ token, onSelectGame, currentUser }) {
  /**
   * Game lobby for listing active games, creating new games, and joining existing ones.
   * onSelectGame(gameId) is called when the user joins/creates a game.
   */
  const [games, setGames] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const primary = "#2196F3";
  const secondary = "#4CAF50";
  const accent = "#FFC107";

  async function refresh() {
    setBusy(true);
    setError("");
    try {
      const gList = await fetchGames(token);
      setGames(gList);
    } catch (err) {
      setError("Could not fetch games");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateGame() {
    setBusy(true);
    setError("");
    try {
      const game = await createGame(token);
      onSelectGame(game.id || game.game_id || game.uuid);
    } catch (err) {
      setError("Create game failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(gameId) {
    setBusy(true);
    setError("");
    try {
      await joinGame(token, gameId);
      onSelectGame(gameId);
    } catch (err) {
      setError("Join failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={{
      maxWidth: 500,
      margin: "2rem auto",
      background: "#fff",
      border: `1px solid ${primary}`,
      borderRadius: 14,
      padding: "2rem",
      boxShadow: "0 2px 18px rgba(33,150,243,0.08)"
    }}>
      <h2 style={{
        color: primary,
        margin: 0,
        fontWeight: 700,
        fontSize: "2rem"
      }}>Game Lobby</h2>
      <button
        disabled={busy}
        style={{
          margin: "1rem 0",
          background: secondary,
          color: "#fff",
          padding: "0.7rem 2rem",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer"
        }}
        onClick={handleCreateGame}
      >
        + Create New Game
      </button>
      <div>
        {error &&
          <div style={{
            background: accent,
            color: "#333",
            padding: "0.5rem",
            borderRadius: 6,
            marginBottom: 12,
            fontWeight: 500
          }}>{error}</div>
        }
        <div style={{
          opacity: busy ? 0.6 : 1,
        }}>
          {games.length === 0 ? (
            <div style={{color: "#666", fontStyle: "italic", margin: "1.5rem 0"}}>
              No games available. Create one!
            </div>
          ) : (
            <table style={{width: "100%", borderCollapse: "collapse"}}>
              <thead>
                <tr style={{background: "#f6f9fc"}}>
                  <th style={{textAlign: "left", padding: 8, color: primary}}>ID</th>
                  <th style={{padding: 8, color: primary}}>Players</th>
                  <th style={{padding: 8}}>Join</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game.id || game.game_id || game.uuid}>
                    <td style={{padding: 8}}>{game.id || game.game_id || game.uuid}</td>
                    <td style={{padding: 8}}>{game?.players?.length || "?"}/2</td>
                    <td style={{padding: 8}}>
                      <button
                        style={{
                          background: primary,
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "0.4rem 1.2rem",
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                        disabled={busy}
                        onClick={() => handleJoin(game.id || game.game_id || game.uuid)}
                      >Join</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
