import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      fetch("http://localhost:8080/login", {
        method: "POST", // Ensure your backend /login route accepts POST requests
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then(data => {
        // Handle successful login (e.g., save token, redirect)
        console.log("Login successful:", data);
        // Redirect to dashboard after login
        navigate("/dashboard");
      })
      .catch(error => {
        alert(error.message);
      });
    } else {
      alert("Please enter both username and password.");
    }
  };

  return (
    <header>
      {/* <h1>Log in</h1> */}
      <div className="logo">
        <h2>Log in</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <h3>
          Don't have an account? <Link to="/register">Register</Link>
        </h3>
        <button onClick={handleLogin}>Log in</button>
        <br />
        {/* <Link to="/login" style={{ color: "blue", cursor: "pointer" }}>Login</Link> */}
      </div>
    </header>
  );
}

export default Login;

