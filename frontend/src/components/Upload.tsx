// src/components/Upload.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Page2.css"; // ⬅️ layout CSS
import Sidebar from "./Utils/Sidebar";
import CreateStudent from "./Resource/CreateStudent";

export default function Upload() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        activeSection="dashboard"
      />

      {/* Main Content */}
      <main
        className={`mainContent ${
          sidebarCollapsed ? "sidebarCollapsed" : ""
        }`}
      >
        <header className="contentHeader">
          <h1 className="pageTitle">Upload VALP Certificate</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">S</span>
            </div>
          </div>
        </header>

        <div className="contentBody">
          <section className="createStudentSection">
            <CreateStudent />
          </section>
        </div>
      </main>
    </div>
  );
}
