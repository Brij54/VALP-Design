// import React, { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// import "./Records.css";

// import ReadStudent from "./Resource/ReadStudent";

// export default function Records() {
//   const navigate = useNavigate();

//   return (
//     <>
//       <div
//         id="id-21"
//         className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
//       >
//         <ReadStudent />
//       </div>
//     </>
//   );
// }

// src/components/Approve_Reject_Certificate.tsx
import React, { useState } from "react";
import "./Approve_Reject_Certificate.css";
import "./Upload.css";                 // ⬅️ layout + sidebar styles (page12Container, mainContent, etc.)
import Sidebar from "./Utils/Sidebar"; // ⬅️ normal Sidebar component
import UpdateStudent from "./Resource/UpdateStudent";
import ReadStudent from "./Resource/ReadStudent";

export default function Records() {
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
        //       <div
        id="id-21"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      > 
      <h3 className="mb-3" style={{ color: "white" }}>Student Records</h3>
        <ReadStudent />
      </div>

      </main>
    </div>
  );
}
