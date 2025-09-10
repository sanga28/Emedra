import { LayoutDashboard, FileText, Users, Key, Shield, Settings } from "lucide-react";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ get user from context
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  // Generate initials dynamically
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <aside className="sidebar">
      {/* Profile Section */}
      <div className="profile-card">
        <div className="profile-circle">
          {user ? getInitials(`${user.firstName} ${user.lastName}`) : "??"}
        </div>
        <h3>{user ? `${user.firstName} ${user.lastName}` : "Guest User"}</h3>
        <p>{user?.role || "Role not set"}</p>
        <span className="status">Blockchain Connected</span>
      </div>

      {/* Sidebar Menu */}
      <nav className="menu">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/medical-reports" className={({ isActive }) => (isActive ? "active" : "")}>
          <FileText size={18} />
          <span>Medical Reports</span>
        </NavLink>

        <NavLink to="/healthcare-providers" className={({ isActive }) => (isActive ? "active" : "")}>
          <Users size={18} />
          <span>Health Analysis</span>
        </NavLink>

        <NavLink to="/access-requests" className={({ isActive }) => (isActive ? "active" : "")}>
          <Key size={18} />
          <span>Access Requests</span>
        </NavLink>

        <NavLink to="/security-audit" className={({ isActive }) => (isActive ? "active" : "")}>
          <Shield size={18} />
          <span>Security Audit</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Emergency Section */}
      <div className="emergency-box">
        <h4>🚨 Emergency Access</h4>
        <p>Multi-signature vault for critical patient access</p>
        <button className="emergency-btn">Request Emergency Access</button>
      </div>
    </aside>
  );
};

export default Sidebar;
