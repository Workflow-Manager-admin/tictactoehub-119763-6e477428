//
// API helpers for interacting with the backend tic_tac_toe service.
//

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001/api";

// PUBLIC_INTERFACE
export async function registerUser(username, password) {
  /** Register a new user via backend API. */
  const response = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error((await response.json()).detail || "Registration failed");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function loginUser(username, password) {
  /** Authenticate user and get auth token from backend. */
  const response = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error((await response.json()).detail || "Login failed");
  }
  return await response.json(); // Should return token or user info
}

// PUBLIC_INTERFACE
export async function fetchGames(token) {
  /** Fetch all available games for the lobby. */
  const response = await fetch(`${API_BASE}/games`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : undefined
    },
  });
  if (!response.ok) {
    throw new Error("Could not fetch games");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function createGame(token) {
  /** Create a new Tic Tac Toe game. */
  const response = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!response.ok) {
    throw new Error("Could not create game");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function joinGame(token, gameId) {
  /** Join an existing game by ID. */
  const response = await fetch(`${API_BASE}/games/${gameId}/join`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Could not join game");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function fetchGameState(token, gameId) {
  /** Fetch current state of a specific game. */
  const response = await fetch(`${API_BASE}/games/${gameId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Could not fetch game state");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
export async function submitMove(token, gameId, position) {
  /** Submit a new move for the current user in the game. */
  const response = await fetch(`${API_BASE}/games/${gameId}/move`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ position })
  });
  if (!response.ok) {
    throw new Error("Move submission failed");
  }
  return await response.json();
}
