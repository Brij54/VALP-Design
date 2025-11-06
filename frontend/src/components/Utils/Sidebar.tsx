// src/components/Utils/Sidebar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
// CSS is global; you can import here OR rely on CreateStudent importing Upload.css
// import "../Upload.css";

type SidebarProps = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeSection: "dashboard" | "settings";
};

export default function Sidebar({
  sidebarCollapsed,
  toggleSidebar,
  activeSection,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className={`menuToggleBtn ${
          sidebarCollapsed ? "sidebarCollapsed" : ""
        }`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <div className="hamburgerIcon">
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
        </div>
      </button>

      {/* Sidebar Container */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Logo Section */}
        <div className="logoSection">
          <div className="logoCircle" />
          <div className="instituteName">
            International Institute of
            <br />
            Information Technology
            <br />
            Bangalore
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="navMenu">
          <button
            className="navItem"
            onClick={() => navigate("/Page1")}
          >
            <span className="navIcon">🏠</span>
            <span className="navText">
              Dashboard
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
