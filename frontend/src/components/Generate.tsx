// import React, { useState } from "react";
// import "./Approve_Reject_Certificate.css";
// import "./Upload.css";                 // ⬅️ layout + sidebar styles (page12Container, mainContent, etc.)
// import Sidebar from "./Utils/SidebarAdmin"; // ⬅️ normal Sidebar component
// import UpdateStudent from "./Resource/UpdateStudent"
// import ReadStudent from "./Resource/ReadStudent";

// export default function Generate() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   return (
//     <div className="page12Container">
//       {/* Left sidebar */}
//       <Sidebar
//         sidebarCollapsed={sidebarCollapsed}
//         toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
//         activeSection="dashboard"
//       />

//       {/* Right main content */}
//       <main
//         className={`mainContent ${
//           sidebarCollapsed ? "sidebarCollapsed" : ""
//         }`}
//       >
//         {/* Blue header bar */}
//         //       <div
//         id="id-21"
//         className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
//       >
//       <h3 className="mb-3" style={{ color: "white" }}>Student Records</h3>
//         <ReadStudent />
//       </div>

//       </main>
//     </div>
//   );
// }
import React, { useState } from "react";
import "./Approve_Reject_Certificate.css";
import "./Upload.css";
import Sidebar from "./Utils/SidebarAdmin";
import apiConfig from "../config/apiConfig"; // adjust path if needed

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function Generate() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEligible(null);
    setRecords([]);

    if (!rollNo.trim()) {
      setError("Please enter a roll number.");
      return;
    }

    try {
      setLoading(true);

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const params = new URLSearchParams({ queryId: "CHECK_VALP_ELIGIBILITY" });
      params.append("args", `roll_no:${rollNo.trim()}`);

      const response = await fetch(
        `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();

      // ⬇️ if your backend now returns a boolean like { eligible: true/false }
      // const isEligible = data.eligible === true;
      // setEligible(isEligible);
      // setRecords(data.records || []);

      // ⬇️ old contract (non-empty resource array = true)
      const res = data.resource || [];
      const isEligible = res.length > 0;

      setEligible(isEligible);
      setRecords(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 called only when backend said eligible === true
  const handleGenerateCertificate = async () => {
    const token = getCookie("access_token");
    const params = new URLSearchParams({
      queryId: "GENERATE_VALP_CERTIFICATE",
      args: `roll_no:${rollNo}`,
    });

    const res = await fetch(
      `${apiConfig.getResourceUrl("student")}?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    const pdfBase64 = data?.[0]?.fileData;
    const fileName = data?.[0]?.fileName;

    if (pdfBase64) {
      const blob = new Blob(
        [Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert("Certificate generation failed!");
    }
  };

  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Main Content */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        <header className="contentHeader d-flex justify-content-between align-items-center mb-4">
          <h1 className="pageTitle">Upload VALP Certificate</h1>
          <div className="userProfile d-flex align-items-center">
            <div className="profileCircle">
              <span className="profileInitial">S</span>
            </div>
          </div>
        </header>

        {/* Centered content wrapper */}
        <div className="d-flex justify-content-center">
          <div
            id="id-21"
            className="d-flex flex-column border border-2 p-4 gap-3 mb-4 bg-white rounded shadow-sm"
            style={{
              width: "95%", // increased width (was 80%)
              maxWidth: "1700px", // gives more breathing space on large screens
            }}
          >
            <h3 className="mb-3 text-dark fw-bold">Student Records</h3>

            {/* Roll number input + button */}
            <form
              onSubmit={handleCheck}
              className="d-flex flex-wrap align-items-center gap-3 mb-3"
            >
              <div className="d-flex align-items-center">
                <label className="form-label mb-0 me-2">Roll Number:</label>
                <input
                  type="text"
                  className="form-control"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Enter roll number (e.g. MT2023154)"
                  style={{ width: "250px" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Eligibility"}
              </button>
            </form>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {/* Eligibility result */}
            {eligible !== null && !loading && (
              <div className="mb-3">
                {eligible ? (
                  <span className="badge bg-success me-3 fs-6">
                    ✅ Eligible (completed required number of courses)
                  </span>
                ) : (
                  <span className="badge bg-danger fs-6">
                    ❌ Not Eligible (has not completed required number of
                    courses)
                  </span>
                )}

                {/* Show Generate Certificate button ONLY when eligible */}
                {eligible === true && (
                  <button
                    className="btn btn-success ms-3 px-4"
                    onClick={handleGenerateCertificate}
                  >
                    Generate Certificate
                  </button>
                )}
              </div>
            )}

            {/* Records Table */}
            {records.length > 0 && (
              <div className="table-responsive mt-3">
                <table className="table table-striped table-bordered align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Roll No</th>
                      <th>Email</th>
                      <th>Batch</th>
                      <th>Course Name</th>
                      <th>Course Duration</th>
                      <th>Platform</th>
                      <th>Completion Date</th>
                      <th>Course Mode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td>{r.roll_no}</td>
                        <td>{r.email}</td>
                        <td>{r.batch}</td>
                        <td>{r.course_name}</td>
                        <td>{r.course_duration}</td>
                        <td>{r.platform}</td>
                        <td>{r.course_completion_date}</td>
                        <td>{r.course_mode}</td>
                        <td>
                          {r.status === true
                            ? "approved"
                            : r.status === false
                            ? "rejected"
                            : "pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {eligible === false &&
              records.length === 0 &&
              !loading &&
              !error && (
                <div className="text-muted">
                  No VALP records found for this roll number.
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
