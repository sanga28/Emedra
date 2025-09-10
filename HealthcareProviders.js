import React, { useState } from "react";
import "../styles/HealthcareProviders.css";
import { FileText, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const HealthcareProviders = () => {
  // Dummy health data (replace with API later)
  const [reports] = useState([
    { year: 2023, bloodSugar: 110, weight: 65 },
    { year: 2024, bloodSugar: 118, weight: 67 },
    { year: 2025, bloodSugar: 125, weight: 70 }
  ]);

  return (
    <main className="content">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h2>Patient Health Insights</h2>
          <p>View reports, progress, and predictions</p>
        </div>
      </header>

      {/* Main Health Section */}
      <section className="stats-grid">
        {/* My Reports */}
        <div className="stat-card">
          <FileText size={32} className="stat-icon reports" />
          <div>
            <h3>My Reports (3 Years)</h3>
            <ul className="report-list">
              {reports.map((r) => (
                <li key={r.year}>
                  {r.year}: Blood Sugar {r.bloodSugar}, Weight {r.weight}kg
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Health Progress */}
        <div className="stat-card">
          <TrendingUp size={32} className="stat-icon progress" />
          <div>
            <h3>Health Progress</h3>
            <LineChart width={250} height={150} data={reports}>
              <Line type="monotone" dataKey="bloodSugar" stroke="#2563eb" />
              <Line type="monotone" dataKey="weight" stroke="#16a34a" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>

        {/* Predictions */}
        <div className="stat-card">
          <Activity size={32} className="stat-icon predictions" />
          <div>
            <h3>Predictions</h3>
            <p>⚠ Blood sugar trend rising</p>
            <p><b>Future Risk:</b> Possible diabetes</p>
            <p><b>Recommendation:</b> Exercise & diet check</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HealthcareProviders;
