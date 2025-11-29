import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import "./addservice.css";
import defaultServices from "../../data/defaultServices";

const categories = [
  { value: "healthcare", label: "Healthcare" },
  { value: "safety", label: "Safety & Security" },
  { value: "education", label: "Education" },
  { value: "utilities", label: "Utilities" },
  { value: "transportation", label: "Transportation" }
];

const statuses = [
  { value: "operational", label: "Operational" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "offline", label: "Offline" }
];

const categoryImages = {
  healthcare: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=60",
  safety: "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=60",
  education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=60",
  utilities: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=60",
  transportation: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60"
};

export default function AddService() {
  const { isLoggedIn = false } = useOutletContext();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    status: "operational",
    address: "",
    phone: "",
    hours: "",
    description: "",
    image: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setForm({
      name: "",
      category: "",
      status: "operational",
      address: "",
      phone: "",
      hours: "",
      description: "",
      image: ""
    });
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.address || !form.description) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    const newService = {
      name: form.name,
      category: form.category,
      status: form.status,
      address: form.address,
      phone: form.phone,
      hours: form.hours || "Contact for hours",
      description: form.description,
      rating: 0,
      image: form.image || categoryImages[form.category] || ""
    };

    try {
      const res = await fetch('http://localhost:5001/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newService)
      });

      if (res.ok) {
        setSuccess(true);
        setError("");
        clearForm();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError("Failed to add service. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      setError("Network error. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container page-section">
        <div className="card warning-card">
          <i className="fas fa-lock" aria-hidden="true" />
          <h2>Admin access only</h2>
          <p>Please login as an administrator to add or update services.</p>
          <Link to="/login" className="btn primary">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section add-service">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Operations · Admin</p>
          <h1>Add a new city service</h1>
          <p>Upload verified services with images so residents can trust the information they see.</p>
        </div>
        <Link to="/services" className="btn secondary">
          View services
        </Link>
      </header>

      {success && (
        <div className="inline-alert success">
          <i className="fas fa-check-circle" aria-hidden="true" />
          Service added successfully
        </div>
      )}

      {error && (
        <div className="inline-alert danger">
          <i className="fas fa-circle-exclamation" aria-hidden="true" />
          {error}
        </div>
      )}

      <form className="card form-card" onSubmit={handleAddService}>
        <div className="form-grid two-col">
          <label>
            <span>Service name *</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Eg. Central Immunization Center"
              required
            />
          </label>
          <label>
            <span>Category *</span>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-grid two-col">
          <label>
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555 000 0000"
            />
          </label>
        </div>

        <label>
          <span>Address *</span>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full civic address"
            required
          />
        </label>

        <div className="form-grid two-col">
          <label>
            <span>Operating hours</span>
            <input
              type="text"
              name="hours"
              value={form.hours}
              onChange={handleChange}
              placeholder="Eg. 9:00 AM - 6:00 PM"
            />
          </label>
          <label className="file-upload">
            <span>Service image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <p>JPG/PNG, up to 2MB</p>
          </label>
        </div>

        {form.image && (
          <div className="image-preview">
            <img src={form.image} alt="Preview" />
          </div>
        )}

        <label>
          <span>Description *</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Share key facilities, entry requirements, or helplines."
            required
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={clearForm}>
            Clear
          </button>
          <button type="submit" className="btn primary">
            <i className="fas fa-plus" aria-hidden="true" />
            Publish service
          </button>
        </div>
      </form>
    </div>
  );
}