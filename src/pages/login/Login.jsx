import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../index.css";

export default function AdminLogin() {
  const { isLoggedIn, setIsLoggedIn } = useOutletContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
      navigate("/add-service");
    }
  }, [navigate, setIsLoggedIn]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/add-service");
    } else {
      setError("Invalid credentials. Try admin / admin123");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container page-section">
        <div className="card success-card">
          <i className="fas fa-user-check" aria-hidden="true" />
          <h2>You are already logged in</h2>
          <p>Head over to the admin tools to add or update services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section login-page">
      <div className="card form-card login-card">
        <div className="login-header">
          <i className="fas fa-user-shield" aria-hidden="true" />
          <h1>Admin login</h1>
          <p>Restricted to authorised city administrators.</p>
        </div>
        {error && (
          <div className="inline-alert danger">
            <i className="fas fa-circle-exclamation" aria-hidden="true" />
            {error}
          </div>
        )}
        <form className="login-form" onSubmit={handleLogin}>
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Sign in
          </button>
        </form>
        <p className="demo-note">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
