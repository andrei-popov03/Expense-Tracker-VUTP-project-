import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './App.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      fetch("http://localhost:5000/login", {
        method: "POST", // Ensure your backend /login route accepts POST requests
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include" // Include credentials if your backend requires them
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
          
        localStorage.setItem('access_token', data.token);//запазваме локално токена
        
        navigate("/Dashboard");
      })
      .catch(error => {
        alert(error.message);
      });
    } else {
      alert("Please enter both username and password.");
    }
  };

  return (
    <header className="login-header">
      {/* <h1>Log in</h1> */}
      <div className="login-container">
        <h2 className="login-h2" >Log in</h2>
        <form className="login-form" onSubmit={handleLogin}></form>
        <input className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <input className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <h3 className="login-h3">
          Don't have an account? <Link className="link-register" to="/register">Register</Link>
        </h3>
        <button className="login-button" onClick={handleLogin}>Log in</button>
        <br />
        {/* <Link to="/login" style={{ color: "blue", cursor: "pointer" }}>Login</Link> */}
      </div>
    </header>
  );
}

export default Login;

