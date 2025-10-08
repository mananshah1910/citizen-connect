import { useState, useEffect } from "react";
import "../../index.css"


function getServiceIcon(category) {
  const icons = {
    healthcare: "hospital",
    safety: "shield-alt",
    education: "graduation-cap",
    utilities: "tools",
    transportation: "bus",
  };
  return icons[category] || "building";
}

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  // Load services from localStorage or fallback data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("services"));
    if (saved && saved.length > 0) {
      setServices(saved);
    } else {
      // fallback data (your original hardcoded services)
      setServices([
        {
          id: 1,
          name: "City General Hospital",
          category: "healthcare",
          address: "123 Medical District, Downtown",
          phone: "+1-555-0101",
          hours: "24/7 Emergency Services",
          description:
            "Full-service hospital with emergency care, surgery, and specialized medical departments.",
          status: "operational",
          rating: 4.5,
        },
        {
          id: 2,
          name: "Central Police Station",
          category: "safety",
          address: "456 Safety Boulevard, City Center",
          phone: "+1-555-0102",
          hours: "24/7",
          description:
            "Main police headquarters providing law enforcement, emergency response, and community safety services.",
          status: "operational",
          rating: 4.2,
        },
          {
          id: 3,
          name: "Manan service",
          category: "timepass",
          address: "456 Safety Boulevard, City Center",
          phone: "+1-555-0102",
          hours: "24/7",
          description:
            "Main police headquarters providing law enforcement, emergency response, and community safety services.",
          status: "operational",
          rating: 5.0,
        }
        // ... add the rest of your initial list here
      ]);
    }
  }, []);

  // Save whenever services change
  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("services", JSON.stringify(services));
    }
  }, [services]);

  // Filtering logic
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category === "all" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="page-content">
      <div className="container">
        <div className="services-header">
          <h1>City Services</h1>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="healthcare">Healthcare</option>
              <option value="safety">Safety & Security</option>
              <option value="education">Education</option>
              <option value="utilities">Utilities</option>
              <option value="transportation">Transportation</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filteredServices.length === 0 ? (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#666",
              }}
            >
              <i
                className="fas fa-search"
                style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
              ></i>
              <h3>No services found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className={`status-badge status-${service.status}`}>
                  {service.status.replace("-", " ")}
                </div>

                <div className="service-header">
                  <div className={`service-icon ${service.category}`}>
                    <i className={`fas fa-${getServiceIcon(service.category)}`} />
                  </div>
                  <div>
                    <div className="service-title">{service.name}</div>
                    <div className="service-category">
                      {service.category.replace("-", " & ")}
                    </div>
                  </div>
                </div>

                <div className="service-description">{service.description}</div>

                <div className="service-details">
                  <div className="service-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{service.address}</span>
                  </div>
                  {service.phone && (
                    <div className="service-detail">
                      <i className="fas fa-phone"></i>
                      <span>{service.phone}</span>
                    </div>
                  )}
                  <div className="service-detail">
                    <i className="fas fa-clock"></i>
                    <span>{service.hours}</span>
                  </div>
                </div>

                {service.rating && (
                  <div className="rating">
                    <div className="stars">
                      {"★".repeat(Math.floor(service.rating))}
                      {"☆".repeat(5 - Math.floor(service.rating))}
                    </div>
                    <span>{service.rating.toFixed(1)} rating</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
