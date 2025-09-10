import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  // ✅ Generate initials safely
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">E-Medra</h2>
        <span className="tagline">Blockchain Healthcare</span>
      </div>

      <div className="navbar-right">
        {/* Show logged in user's initials */}
        <div className="user-avatar">
          {user ? getInitials(`${user.firstName} ${user.lastName}`) : "??"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
