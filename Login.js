import React, { useState, useContext } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Improved Google Login
  const handleGoogleLogin = async () => {
    if (googleLoading) return; // prevent multiple clicks
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Google user:", result.user);

      // If you want to sync with AuthContext
      // login(result.user.email, "GOOGLE_AUTH"); 

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Google login error:", err.code, err.message);
      if (err.code === "auth/cancelled-popup-request") {
        setError("Popup closed too early. Please try again.");
      } else {
        setError("Google login failed. Try again!");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Info Section */}
      <div className="login-left">
        <div className="logo">
          <span className="logo-icon">⚕</span>
          <h1>E-Medra</h1>
        </div>
        <p className="tagline">Health Belongs to You. We Keep it That Way.</p>
        <h2>
          Secure Healthcare <span>Blockchain Platform</span>
        </h2>
        <p className="description">
          Manage your medical records with blockchain-powered security,
          patient-controlled access, and tamper-proof storage.
        </p>
        <div className="features">
          <div className="feature-box">
            <span>🛡</span>
            <p>
              <strong>Secure</strong>
              <br /> Blockchain Protection
            </p>
          </div>
          <div className="feature-box">
            <span>🔒</span>
            <p>
              <strong>Private</strong>
              <br /> End-to-End Encrypted
            </p>
          </div>
          <div className="feature-box">
            <span>👤</span>
            <p>
              <strong>Controlled</strong>
              <br /> Patient-Owned Access
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Card */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to access your secure health records</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="doctor@hospital.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* 🔹 Google Sign In Button */}
          <button
            className="google-login-btn"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? "Connecting to Google..." : "Sign In with Google"}
          </button>

          <div className="login-links">
            <p>
              Don’t have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>

          <div className="login-footer">
            <strong>Blockchain Connected</strong>
            <p>Your login is secured by blockchain technology for maximum protection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
