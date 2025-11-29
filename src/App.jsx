import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.jpeg";

const baseNavLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/complaints", label: "Complaints" }
];

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }
    return prefersDark;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setIsDarkMode(storedTheme === "dark");
      }
      const storedUser = localStorage.getItem("currentUser");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const navLinks = useMemo(() => {
    const links = [...baseNavLinks];
    if (isLoggedIn) {
      links.splice(2, 0, { to: "/add-service", label: "Add Service" });
      links.splice(3, 0, { to: "/admin/users", label: "Admin Users" });
    }
    return links;
  }, [isLoggedIn]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const year = new Date().getFullYear();

  return (
    <div className={`app-shell ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <img src={logo} alt="CitizenConnect logo" />
            <div>
              <span>CitizenConnect</span>
              <small>City services gateway</small>
            </div>
          </Link>

          <nav className="site-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="action-btn icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <i className={`fas fa-${isDarkMode ? "sun" : "moon"}`} />
              <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
            </button>

            {!isLoggedIn && !currentUser && (
              <Link className="action-btn admin-btn" to="/login">
                <i className="fas fa-user-shield" />
                <span>Admin login</span>
              </Link>
            )}

            {isLoggedIn && (
              <button className="action-btn admin-btn" onClick={handleLogout}>
                <i className="fas fa-shield-halved" />
                <span>Admin logout</span>
              </button>
            )}

            {!isLoggedIn && !currentUser && (
              <Link className="action-btn user-btn" to="/user-login">
                <i className="fas fa-user" />
                <span>User login</span>
              </Link>
            )}

            {currentUser && !isLoggedIn && (
              <div className="user-chip">
                <div className="avatar">{currentUser.name?.charAt(0)?.toUpperCase() || "U"}</div>
                <div className="user-meta">
                  <strong>{currentUser.name}</strong>
                  <small>{currentUser.email}</small>
                </div>
                <button className="icon-only-btn" onClick={handleUserLogout} aria-label="User logout">
                  <i className="fas fa-right-from-bracket" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="page-wrapper">
        <Outlet context={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }} />
      </div>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h4>CitizenConnect</h4>
            <p>Your bridge to city services, support, and transparent governance.</p>
          </div>
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li>
                <Link to="/services">All Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact Support</Link>
              </li>
              <li>
                <Link to="/complaints">Raise Complaint</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Need Help?</h5>
            <p>support@citizenconnect.gov</p>
            <p>+1 (555) 000-8899</p>
          </div>
        </div>
        <div className="footer-note">
          © {year} CitizenConnect. Crafted for responsive civic services.
        </div>
      </footer>
    </div>
  );
}

export default App;
