import React, { useState, useEffect } from "react";
import "./App.css";
import AuthForm from "./components/AuthForm";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import Sidebar from "./components/Sidebar";
import {
  fetchGameState,
  submitMove
} from "./api";

// PUBLIC_INTERFACE
function App() {
  /**
   * Root App controls: Auth -- Lobby -- Game -- Sidebar
   */
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null); // {username, token}
  const [page, setPage] = useState("auth"); // auth | lobby | game
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [polling, setPolling] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Set up polling for live game state
  useEffect(() => {
    if (page === "game" && user && gameId) {
      setPolling(setInterval(() => setRefreshTick(tick => tick + 1), 2000));
      return () => polling && clearInterval(polling);
    } else {
      polling && clearInterval(polling);
    }
    // eslint-disable-next-line
  }, [page, user, gameId]);

  useEffect(() => {
    if (page === "game" && user && gameId) {
      refreshGame();
    }
    // eslint-disable-next-line
  }, [refreshTick]);

  function handleLogin(userObj) {
    setUser(userObj);
    setPage("lobby");
  }

  function handleSelectGame(newGameId) {
    setGameId(newGameId);
    setPage("game");
    setGameState(null);
    setRefreshTick(r => r + 1);
    setError("");
  }

  async function refreshGame() {
    setBusy(true);
    setError("");
    try {
      const g = await fetchGameState(user.token, gameId);
      setGameState(g);
    } catch (err) {
      setError("Failed to fetch game");
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(position) {
    try {
      setBusy(true);
      setError("");
      await submitMove(user.token, gameId, position);
      setRefreshTick(t => t + 1); // trigger reload
    } catch (er) {
      setError("Move failed");
    } finally {
      setBusy(false);
    }
  }

  function handleBackToLobby() {
    setGameId(null);
    setGameState(null);
    setPage("lobby");
    setError("");
  }

  function logout() {
    setUser(null);
    setGameId(null);
    setGameState(null);
    setPage("auth");
    setError("");
  }

  // Determine which page to show (auth, lobby, game)
  let main = null;
  if (!user || page === "auth") {
    main = <AuthForm onLogin={handleLogin} />;
  } else if (page === "lobby") {
    main = (
      <Lobby
        token={user.token}
        currentUser={user}
        onSelectGame={handleSelectGame}
      />
    );
  } else if (page === "game") {
    const board = (gameState && gameState.board) || Array(9).fill(null);
    const moves = (gameState && gameState.moves) || [];
    const myMark = (() => {
      if (!gameState || !user) return "?";
      if (gameState.players && gameState.players[0]?.username === user.username)
        return "X";
      if (gameState.players && gameState.players[1]?.username === user.username)
        return "O";
      return "?";
    })();
    const turn = (gameState && gameState.turn) || "X";
    const winner = (gameState && gameState.winner) || null;
    const lastMove = moves.length > 0 ? moves[moves.length - 1].position : null;

    main = (
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        margin: "0 auto"
      }}>
        <div>
          <button
            style={{
              margin: "1.5rem 0 0 0",
              background: "#2196F3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: "0.4rem 1.5rem",
              marginBottom: 16,
              cursor: "pointer"
            }}
            onClick={handleBackToLobby}
          >
            ← Lobby
          </button>
          <GameBoard
            board={board}
            myMark={myMark}
            onMove={handleMove}
            active={myMark === turn && !winner}
            winner={winner}
            lastMove={lastMove}
            disabled={busy}
          />
          {error &&
            <div style={{
              background: "#FFC107",
              color: "#333",
              fontWeight: 500,
              padding: "0.5rem",
              borderRadius: 5,
              margin: "9px auto",
              maxWidth: 220
            }}>{error}</div>
          }
        </div>
        <Sidebar
          user={user}
          game={gameState}
          moves={moves}
          myMark={myMark}
          turn={turn}
          winner={winner}
        />
      </div>
    );
  }

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <div className="App">
      <header className="App-header" style={{minHeight: 0, paddingBottom: 16}}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "95%", maxWidth: 1080, margin: "0 auto"
        }}>
          <h1 style={{
            fontWeight: 800,
            color: "#2196F3",
            fontSize: "2.2rem",
            margin: "24px 0 12px 0"
          }}>Tic Tac Toe 🟦</h1>
          {user && (
            <button
              style={{
                background: "#FF5252",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 15,
                padding: "0.45rem 1.3rem",
                cursor: "pointer",
                marginLeft: 14
              }}
              onClick={logout}
            >Logout</button>
          )}
        </div>
      </header>
      <main>
        {main}
      </main>
      <footer style={{
        textAlign: "center", margin: "2.5rem auto 0 auto",
        color: "#888", fontSize: 13
      }}>
        Powered by <a href="https://kavia.ai" style={{color:"#2196F3"}}>Kavia 🧩</a> — Minimal Tic Tac Toe
      </footer>
    </div>
  );
}

export default App;
