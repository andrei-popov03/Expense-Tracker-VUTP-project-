import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Registration failed.");
      } else {
        setSuccess("Registration successful! You can now log in.");
        setForm({ username: "", email: "", password: "" });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="register-header">
      <div className="register-container">
        <h2 className="register-h2">Register</h2>
        <form onSubmit={handleRegister}>
          <input className="register-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <br />
          <input className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <br />
          <input className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <br />
          <h3 className="register-h3">
            Already have an account? <Link className="login-link" to="/login">Log in</Link>
          </h3>
          <button className="register-button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </header>
  );
}



export default Register;
