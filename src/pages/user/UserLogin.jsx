import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../index.css";

const initialForm = { name: "", email: "", password: "" };

export default function UserLogin() {
  const { currentUser, setCurrentUser } = useOutletContext();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (mode === "signup") {
      if (!form.name || !form.email || !form.password) {
        setError("Fill in all the fields to create an account.");
        return;
      }
      if (users.some((user) => user.email === form.email)) {
        setError("A user with this email already exists.");
        return;
      }
      const newUser = {
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        password: form.password
      };
      const updated = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updated));
      setCurrentUser(newUser);
      setError("");
      navigate("/");
      return;
    }

    // login flow
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (!user) {
      setError("Invalid credentials. Please try again or create an account.");
      return;
    }
    setCurrentUser(user);
    setError("");
    navigate("/");
  };

  return (
    <div className="container page-section login-page">
      <div className="card form-card login-card">
        <div className="login-header">
          <i className="fas fa-users" aria-hidden="true" />
          <h1>{mode === "signup" ? "Create citizen account" : "Citizen login"}</h1>
          <p>
            {mode === "signup"
              ? "Register to track your complaints and personalize services."
              : "Sign in to raise complaints faster and view your activity."}
          </p>
        </div>

        {error && (
          <div className="inline-alert danger">
            <i className="fas fa-circle-exclamation" aria-hidden="true" />
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </label>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </label>
          <button type="submit" className="btn primary">
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="demo-note">
          {mode === "signup" ? "Already have an account?" : "New to CitizenConnect?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode((prev) => (prev === "signup" ? "login" : "signup"));
              setForm(initialForm);
              setError("");
            }}
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}

