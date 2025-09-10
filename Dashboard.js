import React, { useContext, useRef } from "react";
import "../styles/Dashboard.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📂 Selected file:", file.name);

    // Prepare file for upload
    const formData = new FormData();
    formData.append("report", file);

    try {
      const res = await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      alert("✅ Report uploaded successfully!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <main className="content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h2>My Health Records</h2>
            <p>Manage your medical records and control access permissions</p>
          </div>
          <div className="header-actions">
            <button className="export-btn">Export Records</button>
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Record
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".pdf,.jpg,.png,.docx"
          onChange={handleFileChange}
        />

        {/* Stats Section */}
        <section className="stats">
          <div className="stat-card stat-encrypted">
            <div className="stat-title">ENCRYPTED</div>
            <div className="stat-value">0 Medical Records</div>
            <div className="stat-desc">No reports yet</div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-title">PENDING</div>
            <div className="stat-value">0 Pending Approvals</div>
            <div className="stat-desc">All up to date</div>
          </div>

          <div className="stat-card stat-verified">
            <div className="stat-title">VERIFIED</div>
            <div className="stat-value">0 Active Permissions</div>
            <div className="stat-desc">Healthcare providers</div>
          </div>

          <div className="stat-card stat-blockchain">
            <div className="stat-title">PROTECTED</div>
            <div className="stat-value">100% Blockchain Secured</div>
            <div className="stat-desc">All records encrypted</div>
          </div>
        </section>

        {/* Medical Reports Section */}
        <section className="reports-section">
          <div className="report-card">
            <h3>
              My Medical Reports <span>View All (0)</span>
            </h3>
            <div className="empty-state">
              <p>No Medical Reports Yet</p>
              <button
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Your First Report
              </button>
            </div>
          </div>

          <div className="report-card">
            <h3>Pending Access Requests</h3>
            <div className="empty-state">
              <p>No pending requests</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
