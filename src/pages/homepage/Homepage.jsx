import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./homepage.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

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
          <Link to="/" className="logo">
            <img src="/src/assets/logo.jpeg" alt="Logo" style={{ width: "24px" }} />
            CitizenConnect
          </Link>
          <nav>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="active">Home</Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              <li>
                <Link to="/service">All Services</Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link to="addservice">Add Service</Link>
                </li>
              )}
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

      {/* Main Content */}
      <main className="page-content">
        <div className="container">
          {/* Hero Section */}
          <div className="hero">
            <h1>Welcome to CitizenConnect</h1>
            <p>
              Your one-stop solution for accessing city services, infrastructure
              information, and public amenities
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Link to="/services" className="btn">
                Explore Services
              </Link>
              {isLoggedIn ? (
                <Link
                  to="/addservice"
                  className="btn btn-secondary"
                  style={{ marginLeft: "1rem" }}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ marginLeft: "1rem" }}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="features">
            <div className="feature-card">
              <i className="fas fa-hospital"></i>
              <h3>Healthcare Services</h3>
              <p>
                Find hospitals, clinics, and healthcare facilities with
                real-time availability and contact information.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Safety & Security</h3>
              <p>
                Access police stations, fire departments, and emergency services
                for your safety and security needs.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Education</h3>
              <p>
                Discover schools, libraries, and educational institutions with
                detailed information and ratings.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-tools"></i>
              <h3>Public Utilities</h3>
              <p>
                Monitor water, electricity, and waste management services with
                real-time status updates.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-bus"></i>
              <h3>Transportation</h3>
              <p>
                Get information about public transport, road conditions, and
                traffic management systems.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-comments"></i>
              <h3>Feedback System</h3>
              <p>
                Report issues, provide feedback, and help improve city services
                for everyone.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
