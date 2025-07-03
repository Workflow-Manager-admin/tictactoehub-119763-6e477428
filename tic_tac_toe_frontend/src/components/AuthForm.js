import React, { useState } from "react";
import { registerUser, loginUser } from "../api";

// PUBLIC_INTERFACE
export default function AuthForm({ onLogin }) {
  /** Registration & Login form for authentication. */
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const primary = "#2196F3";
  const secondary = "#4CAF50";
  const accent = "#FFC107";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      let result;
      if (isRegister) {
        result = await registerUser(username, password);
      } else {
        result = await loginUser(username, password);
      }
      onLogin({ username, token: result.token || result.access_token || "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{
      maxWidth: 340,
      margin: "3rem auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(33,150,243,0.04)",
      padding: "2rem",
      border: `1px solid ${primary}`,
    }}>
      <h2 style={{
        color: primary,
        marginTop: 0,
        marginBottom: "1.5rem",
        fontWeight: 700,
        fontSize: "2rem"
      }}>
        {isRegister ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text" autoFocus
          placeholder="Username"
          value={username}
          required
          style={{ width: "100%", padding: "0.5rem", fontSize: 16, marginBottom: 12, borderRadius: 6, border: "1px solid #e0e0e0" }}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          style={{ width: "100%", padding: "0.5rem", fontSize: 16, marginBottom: 12, borderRadius: 6, border: "1px solid #e0e0e0" }}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            background: isRegister ? secondary : primary,
            color: "#fff",
            padding: "0.75rem",
            fontWeight: 600,
            fontSize: 17,
            border: "none",
            borderRadius: 7,
            cursor: "pointer",
            marginBottom: 8,
            letterSpacing: "0.015em"
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>
        {error && (
          <div style={{
            background: accent,
            color: "#333",
            padding: "0.5rem",
            borderRadius: 6,
            marginBottom: 8,
            fontWeight: 500,
            fontSize: 15
          }}>
            {error}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button
            type="button"
            style={{
              background: "transparent",
              color: isRegister ? primary : secondary,
              border: "none",
              cursor: "pointer",
              textDecoration: "underline"
            }}
            onClick={() => setIsRegister(v => !v)}
          >
            {isRegister ? "Already have an account? Login" : "No account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
