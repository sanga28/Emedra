import React from "react";
import "../styles/AccessRequests.css";
import { Clock, CheckCircle, XCircle, Key } from "lucide-react";

const AccessRequests = () => {
  return (
    <main className="content">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h2>Access Requests</h2>
          <p>Manage medical record access permissions and requests</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="filters">
        <input type="text" placeholder="Search requests by report, provider, or patient" />
        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Denied</option>
        </select>
        <select>
          <option>All Types</option>
          <option>Read Only</option>
          <option>Full Access</option>
        </select>
      </div>

      {/* Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <Clock size={32} className="stat-icon pending" />
          <div>
            <h3>Pending</h3>
            <p>0</p>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle size={32} className="stat-icon approved" />
          <div>
            <h3>Approved</h3>
            <p>0</p>
          </div>
        </div>

        <div className="stat-card">
          <XCircle size={32} className="stat-icon denied" />
          <div>
            <h3>Denied</h3>
            <p>0</p>
          </div>
        </div>

        <div className="stat-card">
          <Key size={32} className="stat-icon total" />
          <div>
            <h3>Total</h3>
            <p>0</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccessRequests;
