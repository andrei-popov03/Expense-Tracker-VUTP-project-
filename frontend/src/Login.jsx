import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import './App.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.msg || "Login failed.");
        return;
      }
      localStorage.setItem('access_token', data.token);
      navigate("/dashboard");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="login-header">
      <div className="login-container">
        <h2 className="login-h2">Log in</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <br />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          {error && <p style={{ color: "red", margin: "8px 0" }}>{error}</p>}
          <h3 className="login-h3">
            Don't have an account? <Link className="link-register" to="/register">Register</Link>
          </h3>
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </header>
  );
}

export default Login;
