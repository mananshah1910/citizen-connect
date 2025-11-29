import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import defaultServices from "../../data/defaultServices";
import "./service.css";

const categories = [
  { value: "all", label: "All categories" },
  { value: "healthcare", label: "Healthcare" },
  { value: "safety", label: "Safety & Security" },
  { value: "education", label: "Education" },
  { value: "utilities", label: "Utilities" },
  { value: "transportation", label: "Transportation" }
];

const icons = {
  healthcare: "hospital",
  safety: "shield-alt",
  education: "graduation-cap",
  utilities: "tools",
  transportation: "bus"
};

const categoryImages = {
  healthcare: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=60",
  safety: "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=60",
  education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=60",
  utilities: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=60",
  transportation: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60"
};

function getServiceIcon(category) {
  return icons[category] || "building";
}

function getServiceImage(service) {
  return (
    service.image ||
    categoryImages[service.category] ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60"
  );
}

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("services") || "null");
    if (saved && saved.length > 0) {
      setServices(saved);
    } else {
      localStorage.setItem("services", JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("services", JSON.stringify(services));
    }
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = category === "all" || service.category === category;
      const matchesStatus = statusFilter === "all" || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, category, statusFilter]);

  return (
    <div className="container page-section services-page">
      <header className="section-heading">
        <div>
          <p className="eyebrow">City Directory</p>
          <h1>Browse all public services</h1>
          <p>Filter by category, status, or keywords to find exactly what you need.</p>
        </div>
        <Link to="/contact" className="btn ghost">
          Need help?
        </Link>
      </header>

      <div className="filters card">
        <div className="search-group">
          <i className="fas fa-search" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by name, description, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <label>
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Under maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search" aria-hidden="true" />
            <h3>No services found</h3>
            <p>Try a different keyword or reset your filters.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <article key={service.id} className="service-card">
              <div className={`status-badge status-${service.status}`}>
                {service.status.replace("-", " ")}
              </div>
              <div className="service-image">
                <img src={getServiceImage(service)} alt={service.name} />
              </div>
              <div className="service-body">
                <div className="service-header">
                  <div className={`service-icon ${service.category}`}>
                    <i className={`fas fa-${getServiceIcon(service.category)}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.category.replace("-", " & ")}</p>
                  </div>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-details">
                  <span>
                    <i className="fas fa-map-marker-alt" /> {service.address}
                  </span>
                  {service.phone && (
                    <span>
                      <i className="fas fa-phone" /> {service.phone}
                    </span>
                  )}
                  {service.hours && (
                    <span>
                      <i className="fas fa-clock" /> {service.hours}
                    </span>
                  )}
                </div>
                <div className="card-actions">
                  <Link className="text-link" to="/contact">
                    Contact support <i className="fas fa-arrow-right" />
                  </Link>
                  <Link className="text-link" to="/complaints">
                    Raise complaint <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
