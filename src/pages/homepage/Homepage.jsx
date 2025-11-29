import { Link, useOutletContext } from "react-router-dom";
import "./homepage.css";

const features = [
  {
    icon: "hospital",
    title: "Healthcare",
    body: "Track nearby hospitals, clinics, and medical camps in real time."
  },
  {
    icon: "shield-alt",
    title: "Safety & Security",
    body: "Locate police, fire, and emergency resources when every minute counts."
  },
  {
    icon: "graduation-cap",
    title: "Education",
    body: "Discover schools, libraries, and skill hubs with verified details."
  },
  {
    icon: "tools",
    title: "Utilities",
    body: "View water, power, and waste services with live status indicators."
  },
  {
    icon: "bus",
    title: "Mobility",
    body: "Stay updated on buses, metro schedules, and last-mile options."
  },
  {
    icon: "comments",
    title: "Feedback & Complaints",
    body: "Escalate issues, monitor responses, and keep agencies accountable."
  }
];

const stats = [
  { label: "Active services", value: "120+" },
  { label: "Resolved complaints", value: "4.9k" },
  { label: "Avg. response time", value: "2 hrs" },
  { label: "City coverage", value: "24 wards" }
];

const quickActions = [
  {
    to: "/contact",
    icon: "headset",
    title: "Contact Support",
    text: "Chat with civic helpdesk or schedule a callback."
  },
  {
    to: "/complaints",
    icon: "exclamation-circle",
    title: "Raise Complaint",
    text: "Report outages, safety concerns, or service delays."
  },
  {
    to: "/services",
    icon: "list-check",
    title: "Browse Services",
    text: "Filter city assets by sector, location, or availability."
  }
];

export default function Home() {
  const { isLoggedIn = false } = useOutletContext();

  return (
    <div className="home-page">
      <section className="hero-panel container">
        <div>
          <p className="eyebrow">Smart city ops · Transparent governance</p>
          <h1>
            Citizen services in one beautiful, responsive control center.
          </h1>
          <p className="lede">
            Discover critical infrastructure, request support, escalate
            complaints, and collaborate with administrators—all without leaving
            your dashboard.
          </p>
          <div className="cta-row">
            <Link to="/services" className="btn primary">
              Explore services
            </Link>
            <Link to={isLoggedIn ? "/add-service" : "/complaints"} className="btn ghost">
              {isLoggedIn ? "Add service" : "Report an issue"}
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="status-pill">
            <span className="dot" /> Systems normal
          </div>
          <p className="hero-card-title">Live operations snapshot</p>
          <ul>
            <li>
              <strong>Healthcare surge line</strong>
              <span>Ready</span>
            </li>
            <li>
              <strong>Flood helpline</strong>
              <span>Monitoring</span>
            </li>
            <li>
              <strong>Waste pickups</strong>
              <span>On schedule</span>
            </li>
          </ul>
          <Link to="/contact" className="card-link">
            Talk to duty officer <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>

      <section className="container stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span>{stat.value}</span>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="container feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="feature-panel">
            <i className={`fas fa-${feature.icon}`} aria-hidden="true" />
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="container quick-actions">
        <header>
          <div>
            <p className="eyebrow">Need assistance?</p>
            <h2>Reach city teams in a tap</h2>
          </div>
          <Link to="/contact" className="btn secondary">
            Contact support
          </Link>
        </header>
        <div className="action-grid">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.to} className="action-card">
              <i className={`fas fa-${action.icon}`} aria-hidden="true" />
              <h3>{action.title}</h3>
              <p>{action.text}</p>
              <span>Open <i className="fas fa-arrow-up-right-from-square" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
