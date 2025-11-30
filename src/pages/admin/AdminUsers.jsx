import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import "../../index.css";

export default function AdminUsers() {
  const { isLoggedIn } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setComplaints(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Failed to delete complaint");
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Error deleting complaint");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users from local storage (as per plan)
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(storedUsers);

        // Fetch complaints from API
        const complaintsRes = await fetch('http://localhost:5001/api/complaints');
        const complaintsData = await complaintsRes.json();
        setComplaints(complaintsData);

        // Fetch services from API
        const servicesRes = await fetch('http://localhost:5001/api/services');
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchData();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="container page-section">
        <div className="card warning-card">
          <i className="fas fa-lock" aria-hidden="true" />
          <h2>Admin access only</h2>
          <p>Login as admin to review registered users.</p>
          <Link to="/login" className="btn primary">
            Go to admin login
          </Link>
        </div>
      </div>
    );
  }

  const complaintsByUser = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
      if (!complaint.userId) return acc;
      acc[complaint.userId] = (acc[complaint.userId] || 0) + 1;
      return acc;
    }, {});
  }, [complaints]);

  const serviceLookup = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id] = service.name;
      return acc;
    }, {});
  }, [services]);

  return (
    <div className="container page-section">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Registered users & complaints</h1>
          <p>Track citizens, their logins, and who raised complaints.</p>
        </div>
      </header>

      <div className="card">
        <div className="table-header">
          <strong>{users.length} users</strong>
          <span>{complaints.length} complaints</span>
        </div>
        {users.length === 0 ? (
          <p>No users registered yet. Ask citizens to create an account.</p>
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <span>Name</span>
              <span>Email</span>
              <span>Complaints raised</span>
            </div>
            {users.map((user) => (
              <div key={user.id} className="table-row">
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{complaintsByUser[user.id] || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="table-header">
          <strong>Recent complaints</strong>
          <div className="search-box" style={{ marginLeft: "auto" }}>
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
        </div>
        {complaints.length === 0 ? (
          <p>No complaints submitted yet.</p>
        ) : (
          <div className="table">
            <div className="table-row table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.5fr" }}>
              <span>Service</span>
              <span>User</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {complaints
              .filter(c => {
                const term = searchTerm.toLowerCase();
                const serviceName = serviceLookup[c.serviceId]?.toLowerCase() || "";
                const userName = (users.find((u) => u.id === c.userId)?.name || c.name || "Guest").toLowerCase();
                const description = c.description?.toLowerCase() || "";
                return serviceName.includes(term) || userName.includes(term) || description.includes(term);
              })
              .map((complaint) => (
                <div key={complaint.id} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.5fr" }}>
                  <span>{serviceLookup[complaint.serviceId] || "Unknown service"}</span>
                  <span>
                    {users.find((u) => u.id === complaint.userId)?.name || complaint.name || "Guest"}
                  </span>
                  <span className={`priority ${complaint.priority}`}>{complaint.priority}</span>
                  <span className={`status-badge ${complaint.status}`}>{complaint.status}</span>
                  <span>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="btn icon-btn danger"
                      title="Delete complaint"
                      style={{ background: "red", border: "none", color: "white", cursor: "pointer", padding: "0.5rem" }}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}