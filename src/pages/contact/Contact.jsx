import { useState } from "react";
import "./contact.css";

const supportChannels = [
  {
    icon: "envelope",
    title: "Email",
    value: "support@citizenconnect.gov",
    helper: "Replies within 2 business hours"
  },
  {
    icon: "phone",
    title: "Emergency line",
    value: "+1 (555) 000-8899",
    helper: "Available 24/7 for critical incidents"
  },
  {
    icon: "comment-dots",
    title: "Live chat",
    value: "Duty officer online",
    helper: "Weekdays · 8:00 AM – 8:00 PM"
  }
];

const faqs = [
  {
    q: "How do I escalate unresolved tickets?",
    a: "Reply to the ticket email with #escalate in the subject or raise a complaint from the Complaints page."
  },
  {
    q: "What documents are required to add a service?",
    a: "Verification letter from the department lead or agency MoU along with identity proof."
  },
  {
    q: "Can citizens see complaint status?",
    a: "Yes, every complaint receives a tracking ID that can be viewed on the Complaints page."
  }
];

export default function ContactSupport() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    message: ""
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    const ticket = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    const stored = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    stored.push(ticket);
    localStorage.setItem("supportTickets", JSON.stringify(stored));
    setStatus("success");
    setForm({ name: "", email: "", topic: "general", message: "" });
  };

  return (
    <div className="container page-section contact-page">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Help desk</p>
          <h1>Contact Civic Support</h1>
          <p>
            Submit a ticket for non-emergency requests. We route every issue to the responsible
            department and keep you updated by email.
          </p>
        </div>
      </header>

      {status === "success" && (
        <div className="inline-alert success">
          <i className="fas fa-check" aria-hidden="true" /> Ticket submitted. We&apos;ll reply shortly.
        </div>
      )}
      {status === "error" && (
        <div className="inline-alert danger">
          <i className="fas fa-circle-exclamation" aria-hidden="true" />
          Please complete all required fields.
        </div>
      )}

      <div className="contact-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <label>
            <span>Your name *</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </label>
          <label>
            <span>Email address *</span>
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
            <span>Topic</span>
            <select name="topic" value={form.topic} onChange={handleChange}>
              <option value="general">General enquiry</option>
              <option value="service">Service issue</option>
              <option value="complaint">Complaint follow-up</option>
              <option value="tech">Platform issue</option>
            </select>
          </label>
          <label>
            <span>Message *</span>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Explain how we can help..."
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Submit ticket
          </button>
        </form>

        <aside className="card support-card">
          <h3>Reach us directly</h3>
          <div className="channel-list">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="channel-item">
                <i className={`fas fa-${channel.icon}`} aria-hidden="true" />
                <div>
                  <p>{channel.title}</p>
                  <strong>{channel.value}</strong>
                  <small>{channel.helper}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-block">
            <h4>FAQs</h4>
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

