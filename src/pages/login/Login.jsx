import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css"
export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state (from localStorage or a variable)
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
      navigate("/addservice"); // redirect if already logged in
    }
  }, [navigate]);

  const handleLogin = () => {
    // Simple demo validation
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/addservice");
    } else {
      alert("Invalid credentials. Try admin / admin123");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <a href="/" className="logo">
            <img src="src/assets/logo.jpeg" alt="Logo" style={{ width: "24px" }} />
            CitizenConnect
          </a>
          <nav>
            <ul className="nav-menu">
              <li><a href="/">Home</a></li>
              <li><a href="/login" className="active">Login</a></li>
              <li><a href="/service">All Services</a></li>
              {isLoggedIn && <li><a href="addservice">Add Service</a></li>}
            </ul>
            {isLoggedIn && (
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <span>Admin</span>
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <main className="page-content">
        <div className="container">
          <div className="login-container">
            <div className="login-header">
              <i className="fas fa-user-shield"></i>
              <h2>Admin Login</h2>
              <p>Access the city management dashboard</p>
            </div>

            {!isLoggedIn && (
              <div className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button onClick={handleLogin} className="btn btn-block">
                  Login
                </button>

                <div style={{ marginTop: "1rem", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
                  {/* Demo credentials */}
                  <strong>admin</strong> / <strong>admin123</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
