import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./addservice.css";

export default function AddService() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    status: "operational",
    address: "",
    phone: "",
    hours: "",
    description: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Load login state + services
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const storedServices = JSON.parse(localStorage.getItem("services")) || [];
    setServices(storedServices);

    if (!loggedIn) {
      // redirect to login if not admin
      navigate("/login");
    }
  }, [navigate]);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Clear form
  const clearForm = () => {
    setForm({
      name: "",
      category: "",
      status: "operational",
      address: "",
      phone: "",
      hours: "",
      description: ""
    });
  };

  // Add service
  const handleAddService = () => {
    if (!form.name || !form.category || !form.address || !form.description) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    const newService = {
      id: services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1,
      name: form.name,
      category: form.category,
      status: form.status,
      address: form.address,
      phone: form.phone,
      hours: form.hours || "Contact for hours",
      description: form.description,
      rating: 0
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));

    setSuccess(true);
    clearForm();

    setTimeout(() => setSuccess(false), 5000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="page-content">
      <div className="container">
        <div className="add-service-form">
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            <i className="fas fa-plus-circle" style={{ color: "#667eea", marginRight: "10px" }}></i>
            Add New Service
          </h2>

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle" style={{ marginRight: "10px" }}></i>
              Service added successfully!
            </div>
          )}

          {/* Form */}
          {isLoggedIn && (
            <div>
              <div className="form-group">
                <label>Service Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="safety">Safety & Security</option>
                    <option value="education">Education</option>
                    <option value="utilities">Utilities</option>
                    <option value="transportation">Transportation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+1-555-0000"
                  />
                </div>
                <div className="form-group">
                  <label>Operating Hours</label>
                  <input
                    type="text"
                    name="hours"
                    value={form.hours}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter detailed service description"
                  rows="4"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={handleAddService} className="btn" style={{ flex: 1 }}>
                  <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
                  Add Service
                </button>
                <button
                  onClick={clearForm}
                  className="btn"
                  style={{ flex: 1, background: "#6c757d" }}
                >
                  <i className="fas fa-eraser" style={{ marginRight: "8px" }}></i>
                  Clear Form
                </button>
              </div>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Link to="/service" className="btn btn-secondary">
                  <i className="fas fa-eye" style={{ marginRight: "8px" }}></i>
                  View All Services
                </Link>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div
              className="alert"
              style={{
                background: "#f8d7da",
                color: "#721c24",
                borderColor: "#f5c6cb",
                marginTop: "1rem"
              }}
            >
              <i className="fas fa-exclamation-triangle" style={{ marginRight: "10px" }}></i>
              Access denied. Please login as admin to add services.
              <div style={{ marginTop: "10px" }}>
                <Link to="/login" className="btn" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                  Login Here
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
