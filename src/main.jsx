import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Home from "./pages/homepage/Homepage.jsx";
import AddService from "./pages/addservice/AddService.jsx";
import AdminLogin from "./pages/login/Login.jsx";
import AllService from "./pages/service/Service.jsx";
import ContactSupport from "./pages/contact/Contact.jsx";
import Complaints from "./pages/complaints/Complaints.jsx";
import UserLogin from "./pages/user/UserLogin.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="services" element={<AllService />} />
          <Route path="service" element={<Navigate to="/services" replace />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="addservice" element={<Navigate to="/add-service" replace />} />
          <Route path="user-login" element={<UserLogin />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="contact" element={<ContactSupport />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
