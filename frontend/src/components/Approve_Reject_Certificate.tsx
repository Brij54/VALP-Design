// src/components/Approve_Reject_Certificate.tsx
import React, { useState } from "react";
import "./Approve_Reject_Certificate.css";
import "./Upload.css";                 // ⬅️ layout + sidebar styles (page12Container, mainContent, etc.)
import Sidebar from "./Utils/SidebarAdmin"; // ⬅️ normal Sidebar component
import UpdateStudent from "./Resource/UpdateStudent";

export default function Approve_Reject_Certificate() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="page12Container">
      {/* Left sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Right main content */}
      <main
        className={`mainContent ${
          sidebarCollapsed ? "sidebarCollapsed" : ""
        }`}
      >
        {/* Blue header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Approve / Reject Certificate</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">A</span>
            </div>
          </div>
        </header>

        {/* White card area */}
        <div className="contentBody">
          <section className="createStudentSection">
            <div className="pageFormContainer">
              <h2 className="fw-semibold mb-3">Student Certificates</h2>

              {/* Your AG-Grid table for students */}
              <UpdateStudent />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
