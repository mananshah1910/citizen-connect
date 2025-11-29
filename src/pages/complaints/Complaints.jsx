import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./complaints.css";
import defaultServices from "../../data/defaultServices";

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

export default function Complaints() {
  const { currentUser } = useOutletContext();
  const [services, setServices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    serviceId: "",
    name: "",
    contact: "",
    priority: "medium",
    description: ""
  });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const loadData = async () => {
      try {
        const servicesRes = await fetch('http://localhost:5001/api/services');
        const servicesData = await servicesRes.json();
        setServices(servicesData);

        const complaintsRes = await fetch('http://localhost:5001/api/complaints');
        const complaintsData = await complaintsRes.json();
        setComplaints(complaintsData);

        // Users still from local storage for now as we didn't make a user API
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(storedUsers);
      } catch (error) {
        console.error("Failed to load data:", error);
        // Fallback to default services if API fails? Or just show error?
        // For now, let's just log it.
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: currentUser.name,
        contact: currentUser.email
      }));
    }
  }, [currentUser]);

  // Removed localStorage sync for complaints as we now persist to backend (in memory)

  const serviceLookup = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id] = service.name;
      return acc;
    }, {});
  }, [services]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.serviceId || !form.name || !form.description) {
      setStatus("error");
      return;
    }

    const newComplaint = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "open",
      userId: currentUser?.id || null
    };

    try {
      const res = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComplaint)
      });

      if (res.ok) {
        const savedComplaint = await res.json();
        setComplaints((prev) => [savedComplaint, ...prev]);
        setForm({
          serviceId: "",
          name: currentUser?.name || "",
          contact: currentUser?.email || "",
          priority: "medium",
          description: ""
        });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      setStatus("error");
    }
  };

  return (
    <div className="container page-section complaints-page">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Citizen desk</p>
          <h1>Raise a complaint</h1>
          <p>
            Tell us what went wrong. Complaints are routed to departments and tracked with a
            reference ID you can share.
          </p>
        </div>
      </header>

      {status === "success" && (
        <div className="inline-alert success">
          <i className="fas fa-check" aria-hidden="true" />
          Complaint logged. Track updates below.
        </div>
      )}
      {status === "error" && (
        <div className="inline-alert danger">
          <i className="fas fa-circle-exclamation" aria-hidden="true" />
          Select a service, add your name, and describe the issue.
        </div>
      )}

      <div className="complaint-layout">
        <form className="card form-card" onSubmit={handleSubmit}>
          <label>
            <span>Service *</span>
            <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
              <option value="">Select affected service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Your name *</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              disabled={Boolean(currentUser)}
            />
          </label>
          <label>
            <span>Contact (email or phone)</span>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Optional"
              disabled={Boolean(currentUser)}
            />
          </label>
          <label>
            <span>Priority</span>
            <div className="priority-row">
              {priorities.map((priority) => (
                <label key={priority.value} className="chip">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={form.priority === priority.value}
                    onChange={handleChange}
                  />
                  <span>{priority.label}</span>
                </label>
              ))}
            </div>
          </label>
          <label>
            <span>Description *</span>
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the issue, location, and expected resolution."
              required
            />
          </label>

          <button type="submit" className="btn primary">
            Submit complaint
          </button>
        </form>

        <section className="card complaints-list">
          <header>
            <h3>Recent complaints</h3>
            <p>{complaints.length || "No"} records</p>
          </header>

          {complaints.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox" aria-hidden="true" />
              <p>No complaints yet. Your reports keep the city accountable.</p>
            </div>
          ) : (
            <ul>
              {complaints.map((complaint) => (
                <li key={complaint.id}>
                  <div className="complaint-heading">
                    <strong>{serviceLookup[complaint.serviceId] || "Unknown service"}</strong>
                    <span className={`status-badge ${complaint.status}`}>{complaint.status}</span>
                  </div>
                  <p>{complaint.description}</p>
                  <div className="meta">
                    <span>
                      <i className="fas fa-user" />{" "}
                      {users.find((u) => u.id === complaint.userId)?.name || complaint.name}
                    </span>
                    <span className={`priority ${complaint.priority}`}>
                      <i className="fas fa-signal" /> {complaint.priority}
                    </span>
                    <span>
                      <i className="fas fa-clock" /> {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}