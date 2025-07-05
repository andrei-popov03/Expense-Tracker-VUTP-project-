function Header() {
  return (
    <header>
        {/* <h1>Log in</h1> */}
        <div className="logo">
            <h2>Log in</h2>
            <input type="text" placeholder="Username" />
            <br />
            <input type="password" placeholder="Password" /> 
            <h3>Don't have an account? <a href="/register">Register</a></h3>
            <button onClick={login}>Log in</button>
        </div>
    </header>

    
  );
}

import React, { useRef } from "react";

function login() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (username && password) {
        // Here you would typically send a request to your backend to log in
        console.log(`Logging in with username: ${username} and password: ${password}`);
    } else {
        alert("Please enter both username and password.");
    }
}

export default Header;

