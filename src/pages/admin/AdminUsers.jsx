import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import "../../index.css";

export default function AdminUsers() {
  const { isLoggedIn } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const readData = () => {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
      const storedServices = JSON.parse(localStorage.getItem("services") || "[]");
      setUsers(storedUsers);
      setComplaints(storedComplaints);
      setServices(storedServices);
    };

    readData();
    const handler = () => readData();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
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
        </div>
        {complaints.length === 0 ? (
          <p>No complaints submitted yet.</p>
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <span>Service</span>
              <span>User</span>
              <span>Priority</span>
              <span>Status</span>
            </div>
            {complaints.slice(0, 10).map((complaint) => (
              <div key={complaint.id} className="table-row">
                <span>{serviceLookup[complaint.serviceId] || "Unknown service"}</span>
                <span>
                  {users.find((u) => u.id === complaint.userId)?.name || complaint.name || "Guest"}
                </span>
                <span className={`priority ${complaint.priority}`}>{complaint.priority}</span>
                <span className={`status-badge ${complaint.status}`}>{complaint.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

