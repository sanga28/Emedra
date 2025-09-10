import React, { useRef, useState, useEffect } from "react";
import {
  storeOnBlockchain,
  getAllReports,
  getMyReports,
  editReport,
} from "../services/blockchainService";
import { ethers } from "ethers";

const DOCTORS = [
  "0x1234567890abcdef1234567890abcdef12345678", // ✅ Replace with real doctor wallet addresses
];

const MedicalReports = () => {
  const fileInputRef = useRef(null);
  const [hash, setHash] = useState("");
  const [uploadedHash, setUploadedHash] = useState(""); // ✅ Show uploaded hash
  const [myReports, setMyReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newHash, setNewHash] = useState("");
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState("guest"); // guest | patient | doctor

  // 🔹 Detect wallet & assign role
  useEffect(() => {
    const loadAccount = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);

      if (DOCTORS.map((d) => d.toLowerCase()).includes(addr.toLowerCase())) {
        setRole("doctor");
      } else {
        setRole("patient");
      }
    };

    loadAccount();
  }, []);

  // File upload handler (only for patients)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("report", file);

    try {
      const res = await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      // ✅ Show uploaded file hash on UI
      setUploadedHash(data.hash);

      // ✅ Also store on blockchain automatically
      await storeOnBlockchain(data.hash);
      alert("✅ Report uploaded and stored!");

      fetchMyReports();
      fetchAllReports();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Store hash manually
  const handleStore = async () => {
    if (!hash) return alert("⚠️ Enter a hash first!");
    try {
      await storeOnBlockchain(hash);
      alert("✅ Stored on blockchain!");

      fetchMyReports();
      fetchAllReports();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const fetchMyReports = async () => {
    try {
      const reports = await getMyReports();
      setMyReports(reports);
    } catch (err) {
      alert("❌ Failed to fetch my reports: " + err.message);
    }
  };

  const fetchAllReports = async () => {
    try {
      const reports = await getAllReports();
      setAllReports(reports);
    } catch (err) {
      alert("❌ Failed to fetch all reports: " + err.message);
    }
  };

  const handleEdit = async () => {
    if (editIndex === null || !newHash) return alert("⚠️ Enter new hash first!");
    try {
      await editReport(editIndex, newHash);
      alert("✅ Report updated!");

      setEditIndex(null);
      setNewHash("");
      fetchMyReports();
      fetchAllReports();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ✅ Copy hash to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Hash copied to clipboard!");
  };

  return (
    <main className="content">
      <header className="dashboard-header">
        <div>
          <h2>Medical Reports</h2>
          <p>Upload, view, and manage health records securely.</p>
          <p>
            Connected as: <b>{account || "Not Connected"}</b> ({role})
          </p>
        </div>
        <div className="header-actions">
          {role === "patient" && (
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Report
            </button>
          )}
          <button onClick={fetchAllReports}>Fetch All Reports</button>
          {role === "patient" && (
            <button onClick={fetchMyReports}>My Reports</button>
          )}
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

      {/* ✅ Show uploaded hash after file upload */}
      {uploadedHash && (
        <section className="uploaded-hash">
          <h3>Uploaded File Hash</h3>
          <p>{uploadedHash}</p>
          <button onClick={() => copyToClipboard(uploadedHash)}>
            Copy Hash
          </button>
        </section>
      )}

      {/* Only patients can upload manually */}
      {role === "patient" && (
        <section className="medical-reports">
          <h3>Manual Upload</h3>
          <input
            type="text"
            placeholder="Enter report hash"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
          <br></br>
          <br></br>
          <button onClick={handleStore}>
            Store on Blockchain
            </button>
        </section>
      )}

      {/* My Reports (patients only) */}
      {role === "patient" && (
        <section className="medical-reports">
          <h3>My Reports (Editable)</h3>
          {myReports.length === 0 ? (
            <p>No reports uploaded yet.</p>
          ) : (
            <ul>
              {myReports.map((r, i) => (
                <li key={i}>
                  <a
                    href={`https://ipfs.io/ipfs/${r.hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View My Report {i + 1}
                  </a>{" "}
                  (Owner: {r.owner})
                  <button onClick={() => setEditIndex(i)}>✏️ Edit</button>
                </li>
              ))}
            </ul>
          )}

          {editIndex !== null && (
            <div>
              <h4>Edit Report #{editIndex}</h4>
              <input
                type="text"
                placeholder="Enter new IPFS hash"
                value={newHash}
                onChange={(e) => setNewHash(e.target.value)}
              />
              <button onClick={handleEdit}>Update</button>
              <button onClick={() => setEditIndex(null)}>Cancel</button>
            </div>
          )}
        </section>
      )}

      {/* All Reports (everyone can see) */}
      <section className="medical-reports">
        <h3>All Reports (Read-Only)</h3>
        {allReports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul>
            {allReports.map((r, i) => (
              <li key={i}>
                <a
                  href={`https://ipfs.io/ipfs/${r.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Report {i + 1}
                </a>{" "}
                (Owner: {r.owner})
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default MedicalReports;
