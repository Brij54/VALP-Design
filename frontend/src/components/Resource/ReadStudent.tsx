// // import React, { useState, useEffect } from "react";
// // import apiConfig from "../../config/apiConfig";
// // import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// // import { AgGridReact } from "ag-grid-react";
// // import { useQuery } from "@tanstack/react-query";
// // import StudentModel from "../../models/StudentModel";

// // ModuleRegistry.registerModules([AllCommunityModule]);

// // export type ResourceMetaData = {
// //   resource: string;
// //   fieldValues: any[];
// // };

// // const getCookie = (name: string): string | null => {
// //   const value = `; ${document.cookie}`;
// //   const parts = value.split(`; ${name}=`);
// //   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
// //   return null;
// // };

// // const ReadStudent = () => {
// //   const [rowData, setRowData] = useState<any[]>([]);
// //   const [colDef1, setColDef1] = useState<any[]>([]);
// //   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
// //   const [fields, setFields] = useState<any[]>([]);
// //   const [requiredFields, setRequiredFields] = useState<string[]>([]);
// //   const [fetchData, setFetchedData] = useState<any[]>([]);
// //   const [showToast, setShowToast] = useState<boolean>(false);

// //   const regex = /^(g_|archived|extra_data)/;

// //   // --- Fetch Student Data ---
// //   const { data: dataRes } = useQuery({
// //     queryKey: ["resourceData", "student"],
// //     queryFn: async () => {
// //       const params = new URLSearchParams();
// //       const queryId: any = "GET_ALL";
// //       params.append("queryId", queryId);

// //       const accessToken = getCookie("access_token");
// //       if (!accessToken) throw new Error("Access token not found");

// //       const response = await fetch(
// //         `${apiConfig.getResourceUrl("student")}?` + params.toString(),
// //         {
// //           method: "GET",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //           },
// //           credentials: "include",
// //         }
// //       );

// //       if (!response.ok) throw new Error("Error: " + response.status);

// //       const data = await response.json();
// //       setFetchedData(data.resource || []);

// //       // Enrich rows with the name
// //       const enrichedRows = await Promise.all(
// //         data.resource.map(async (row: any) => {
// //           const nameParams = new URLSearchParams({
// //             queryId: "GET_NAME_BY_BATCH"
// //           });
// //           nameParams.append('args',`batch:${row.batch}`);

// //           const nameResponse = await fetch(
// //             `${apiConfig.getResourceUrl("student")}?` + nameParams.toString(),
// //             {
// //               headers: { "Content-Type": "application/json",
// //                 Authorization: `Bearer ${accessToken}`,
// //                },
// //               credentials: "include",
// //             }
// //           );
// //           if(nameResponse.ok){
// //             const nameData = await nameResponse.json();
// //             const resources = nameData.resource[0].name;

// //             const batchName = resources.find((r: any) => r.batch_name).batch_name || '';

// //             console.log('batchName', batchName)

// //             return {
// //               ...row,
// //               batch_name: batchName
// //             }
// //           }
// //           return {
// //             ...row,
// //             batch_name: ''
// //           }
// //         })
// //       )
// //       setRowData(enrichedRows);
// //       console.log('enrichedRows', enrichedRows)
// //       return enrichedRows
// //     },
// //   });

// //   // --- Fetch Metadata ---
// //   const { data: dataResMeta } = useQuery({
// //     queryKey: ["resourceMetaData", "student"],
// //     queryFn: async () => {
// //       const response = await fetch(
// //         `${apiConfig.getResourceMetaDataUrl("student")}?`,
// //         {
// //           method: "GET",
// //           headers: { "Content-Type": "application/json" },
// //         }
// //       );

// //       if (!response.ok) throw new Error("Error: " + response.status);

// //       const data = await response.json();
// //       setResMetaData(data);
// //       setFields(data[0]?.fieldValues || []);

// //       const required = data[0]?.fieldValues
// //         .filter((field: any) => !regex.test(field.name))
// //         .map((field: any) => field.name);
// //       setRequiredFields(required || []);

// //       return data;
// //     },
// //   });

// //   // --- Transform fetched data into model format ---
// //   useEffect(() => {
// //     if (fetchData && fetchData.length > 0) {
// //       const modelObjects = fetchData.map((obj: any) =>
// //         StudentModel.fromJson(obj)
// //       );
// //       const jsonObjects = modelObjects.map((model: any) => model.toJson());
// //       setRowData(jsonObjects);
// //     }
// //   }, [fetchData]);

// //   // --- Define Columns for AG Grid ---
// //   useEffect(() => {
// //     const fields = requiredFields.filter((field: any) => field !== "id") || [];

// //     const columns = fields.map((field: any) => {
// //       // ✅ Custom Renderer for Upload Certificate column
// //       if (field === "upload_certificate") {
// //         return {
// //           field: field,
// //           headerName: "Upload Certificate",
// //           resizable: true,
// //           sortable: true,
// //           filter: true,
// //           width: 160,
// //           cellRenderer: (params: any) => {
// //             const documentId = params.value;
// //             const userId = params.data.user_id;

// //             if (!documentId) {
// //               return <span style={{ color: "#888" }}>No file</span>;
// //             }

// //             const handleDownload = async (e: any) => {
// //               e.stopPropagation();
// //               const accessToken = getCookie("access_token"); // 👈 fetch token

// //               try {
// //                 const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;

// //                 const response = await fetch(url, {
// //                   method: "GET",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${accessToken}`,
// //                   },
// //                   credentials: "include",
// //                 });

// //                 if (!response.ok) {
// //                   throw new Error(`Download failed: ${response.status}`);
// //                 }

// //                 const blob = await response.blob();
// //                 const downloadUrl = window.URL.createObjectURL(blob);

// //                 const a = document.createElement("a");
// //                 a.href = downloadUrl;

// //                 const contentDisposition = response.headers.get(
// //                   "Content-Disposition"
// //                 );
// //                 const filename =
// //                   contentDisposition
// //                     ?.split("filename=")[1]
// //                     ?.replace(/['"]/g, "") || "downloaded_file";

// //                 a.download = filename;
// //                 document.body.appendChild(a);
// //                 a.click();
// //                 a.remove();
// //                 window.URL.revokeObjectURL(downloadUrl);
// //               } catch (error) {
// //                 console.error("Error downloading file:", error);
// //               }
// //             };

// //             return (
// //               <button
// //                 onClick={handleDownload}
// //                 style={{
// //                   backgroundColor: "#1976d2",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "4px",
// //                   padding: "4px 8px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Download
// //               </button>
// //             );
// //           },
// //         };
// //       }

// //       // Default columns
// //       return {
// //         field: field,
// //         headerName: field,
// //         editable: false,
// //         resizable: true,
// //         sortable: true,
// //         filter: true,
// //       };
// //     });

// //     setColDef1(columns);
// //   }, [fetchData, requiredFields]);

// //   const defaultColDef = {
// //     flex: 1,
// //     minWidth: 100,
// //     editable: false,
// //   };

// //   return (
// //     <div>
// //       <div>
// //         {rowData.length === 0 && colDef1.length === 0 ? (
// //           <div>No data available. Please add a resource attribute.</div>
// //         ) : (
// //           <div
// //             className="ag-theme-alpine"
// //             style={{ height: 500, width: "100%" }}
// //           >
// //             <AgGridReact
// //               rowData={rowData}
// //               columnDefs={colDef1}
// //               defaultColDef={defaultColDef}
// //               pagination={true}
// //               paginationPageSize={10}
// //               animateRows={true}
// //               rowSelection="multiple"
// //             />
// //           </div>
// //         )}
// //       </div>

// //       {showToast && (
// //         <div
// //           className="toast-container position-fixed top-20 start-50 translate-middle p-3"
// //           style={{ zIndex: 1550 }}
// //         >
// //           <div
// //             className="toast show"
// //             role="alert"
// //             aria-live="assertive"
// //             aria-atomic="true"
// //           >
// //             <div className="toast-header">
// //               <strong className="me-auto">Success</strong>
// //               <button
// //                 type="button"
// //                 className="btn-close"
// //                 data-bs-dismiss="toast"
// //                 aria-label="Close"
// //                 onClick={() => setShowToast(false)}
// //               ></button>
// //             </div>
// //             <div className="toast-body text-success text-center">
// //               Created successfully!
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ReadStudent;


// import React, { useState, useEffect, useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// import StudentModel from "../../models/StudentModel";

// ModuleRegistry.registerModules([AllCommunityModule]);

// export type ResourceMetaData = {
//   resource: string;
//   fieldValues: any[];
// };

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const ReadStudent = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDefs, setColDefs] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<boolean>(false);

//   const regex = /^(g_|archived|extra_data)/;

//   // --- Fetch Student Data ---
//   const { data: studentData } = useQuery({
//     queryKey: ["resourceData", "student"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token not found");

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) throw new Error("Error: " + response.status);
//       const data = await response.json();
//       setFetchedData(data.resource || []);
//       return data.resource || [];
//     },
//   });

//   // --- Fetch Metadata ---
//   useQuery({
//     queryKey: ["resourceMetaData", "student"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("student")}?`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) throw new Error("Error: " + response.status);

//       const data = await response.json();
//       setResMetaData(data);
//       const required = data[0]?.fieldValues
//         .filter((field: any) => !regex.test(field.name))
//         .map((field: any) => field.name);
//       setRequiredFields(required || []);
//       return data;
//     },
//   });

//   // --- Enrich student data with batch_name ---
//   useEffect(() => {
//     const enrichData = async () => {
//       const accessToken = getCookie("access_token");
//       if (!fetchData.length || !accessToken) return;

//       const enrichedRows = await Promise.all(
//         fetchData.map(async (row: any) => {
//           try {
//             const params = new URLSearchParams({
//               queryId: "GET_NAME_BY_BATCH",
//             });
//             // backend expects batch id, not name
//             params.append("args", `batch:${row.batch}`);

//             const nameResponse = await fetch(
//               `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                   "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//               }
//             );

//             if (nameResponse.ok) {
//               const nameData = await nameResponse.json();
//               const resources = nameData.resource || [];

//               // find batch name field
//               const batchRes = resources.find((r: any) => r.name || r.batch_name);
//               const batchName =
//                 batchRes?.name || batchRes?.batch_name || "Unknown";

//               return { ...row, batch_name: batchName };
//             }
//             return { ...row, batch_name: "Unknown" };
//           } catch (err) {
//             console.error("Error enriching batch:", err);
//             return { ...row, batch_name: "Unknown" };
//           }
//         })
//       );

//       setRowData(enrichedRows);
//       console.log("✅ Enriched Rows:", enrichedRows);
//     };

//     enrichData();
//   }, [fetchData]);

//   // --- Define Columns (similar to your old examscheduling) ---
//   const colDefs1 = useMemo(() => {
//     return [
//       { headerName: "Roll No", field: "roll_no", sortable: true, filter: true },
//       { headerName: "Email", field: "email", sortable: true, filter: true },
//       { headerName: "Course Name", field: "course_name", sortable: true, filter: true },
//       { headerName: "Platform", field: "platform", sortable: true, filter: true },
//       { headerName: "Course Duration", field: "course_duration", sortable: true, filter: true },
//       { headerName: "Batch", field: "batch_name", sortable: true, filter: true },
//       {
//       headerName: "Status",
//       field: "status",
//       sortable: true,
//       filter: true,
//       cellRenderer: (params: any) => {
//         const status = params.value;
//         let color = "gray";

//         if (status === "approved") color = "green";
//         else if (status === "rejected") color = "red";
//         else if (status === "pending") color = "orange";

//         return (
//           <span style={{ color, fontWeight: "bold", textTransform: "capitalize" }}>
//             {status || "pending"}
//           </span>
//         );
//       },
//     },
//       {
//         headerName: "Upload Certificate",
//         field: "upload_certificate",
//         cellRenderer: (params: any) => {
//           const documentId = params.value;
//           const userId = params.data.user_id;
//           const accessToken = getCookie("access_token");

//           const handleDownload = async (e: any) => {
//             e.stopPropagation();
//             try {
//               const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;
//               const response = await fetch(url, {
//                 method: "GET",
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                   "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//               });
//               if (!response.ok) throw new Error(`Download failed: ${response.status}`);
//               const blob = await response.blob();
//               const downloadUrl = window.URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = downloadUrl;
//               const filename =
//                 response.headers
//                   .get("Content-Disposition")
//                   ?.split("filename=")[1]
//                   ?.replace(/['"]/g, "") || "downloaded_file";
//               a.download = filename;
//               document.body.appendChild(a);
//               a.click();
//               a.remove();
//               window.URL.revokeObjectURL(downloadUrl);
//             } catch (error) {
//               console.error("Error downloading file:", error);
//             }
//           };

//           return (
//             <button
//               onClick={handleDownload}
//               style={{
//                 backgroundColor: "#1976d2",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 cursor: "pointer",
//               }}
//             >
//               Download
//             </button>
//           );
//         },
//       },
//     ];
//   }, [rowData]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   return (
//     <div>
//       {rowData.length === 0 ? (
//         <div>No student data available.</div>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={colDefs1}
//             defaultColDef={defaultColDef}
//             pagination={true}
//             paginationPageSize={10}
//             animateRows={true}
//           />
//         </div>
//       )}

//       {showToast && (
//         <div
//           className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//           style={{ zIndex: 1550 }}
//         >
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="toast"
//                 aria-label="Close"
//                 onClick={() => setShowToast(false)}
//               ></button>
//             </div>
//             <div className="toast-body text-success text-center">
//               Created successfully!
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReadStudent;


import React, { useState, useEffect, useMemo } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const ReadStudent = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);

  const regex = /^(g_|archived|extra_data)/;

  // --- Fetch Student Data ---
  const { data: studentData } = useQuery({
    queryKey: ["resourceData", "student"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });
      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

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
      setFetchedData(data.resource || []);
      return data.resource || [];
    },
  });

  // --- Fetch Metadata ---
  useQuery({
    queryKey: ["resourceMetaData", "student"],
    queryFn: async () => {
      const response = await fetch(
        `${apiConfig.getResourceMetaDataUrl("student")}?`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Error: " + response.status);
      const data = await response.json();
      setResMetaData(data);
      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);
      setRequiredFields(required || []);
      return data;
    },
  });

  // --- Enrich student data with batch_name ---
  useEffect(() => {
    const enrichData = async () => {
      const accessToken = getCookie("access_token");
      if (!fetchData.length || !accessToken) return;

      const enrichedRows = await Promise.all(
        fetchData.map(async (row: any) => {
          try {
            const params = new URLSearchParams({ queryId: "GET_NAME_BY_BATCH" });
            params.append("args", `batch:${row.batch}`);

            const nameResponse = await fetch(
              `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
              {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
                credentials: "include",
              }
            );

            if (nameResponse.ok) {
              const nameData = await nameResponse.json();
              const resources = nameData.resource || [];
              const batchRes = resources.find((r: any) => r.name || r.batch_name);
              const batchName = batchRes?.name || batchRes?.batch_name || "Unknown";
              return { ...row, batch_name: batchName };
            }
            return { ...row, batch_name: "Unknown" };
          } catch (err) {
            console.error("Error enriching batch:", err);
            return { ...row, batch_name: "Unknown" };
          }
        })
      );

      setRowData(enrichedRows);
    };

    enrichData();
  }, [fetchData]);

  // --- Helper for Status Badge ---
  const getStatusBadge = (status: any) => {
    if (status === "approved" || status === true) {
      return <span className="badge bg-success text-white">✅ Approved</span>;
    } else if (status === "rejected" || status === false) {
      return <span className="badge bg-danger text-white">❌ Rejected</span>;
    } else {
      return <span className="badge bg-secondary text-white">⏳ Pending</span>;
    }
  };

  // --- Define Columns ---
  const colDefs = useMemo(() => {
    const cols: any[] = requiredFields
      .filter((field) => field !== "batch" && field !== "user_id") // remove unwanted fields
      .map((field) => {
        // Upload certificate column
        if (field === "upload_certificate") {
          return {
            headerName: "Upload Certificate",
            field,
            cellRenderer: (params: any) => {
              const documentId = params.value;
              const userId = params.data.user_id; // internal usage
              const handleDownload = async (e: any) => {
                e.stopPropagation();
                const accessToken = getCookie("access_token");
                try {
                  const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;
                  const response = await fetch(url, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
                    credentials: "include",
                  });
                  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
                  const blob = await response.blob();
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  const filename =
                    response.headers
                      .get("Content-Disposition")
                      ?.split("filename=")[1]
                      ?.replace(/['"]/g, "") || "downloaded_file";
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(downloadUrl);
                } catch (error) {
                  console.error("Error downloading file:", error);
                }
              };

              return (
                <button
                  onClick={handleDownload}
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }

        // Status column
        if (field === "status") {
          return {
            headerName: "Status",
            field,
            cellRenderer: (params: any) => getStatusBadge(params.value),
          };
        }

        // Default columns
        return { headerName: field, field, sortable: true, filter: true };
      });

    // --- Insert batch_name after email ---
    const emailIndex = cols.findIndex((c) => c.field === "email");
    if (emailIndex >= 0) {
      cols.splice(emailIndex + 1, 0, { headerName: "Batch", field: "batch_name", sortable: true, filter: true });
    } else if (!cols.find((c) => c.field === "batch_name")) {
      cols.push({ headerName: "Batch", field: "batch_name", sortable: true, filter: true });
    }

    return cols;
  }, [requiredFields]);

  const defaultColDef = { flex: 1, minWidth: 100, editable: false };

  return (
    <div>
      {rowData.length === 0 ? (
        <div>No student data available.</div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            animateRows
          />
        </div>
      )}

      {showToast && (
        <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 1550 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">
              Created successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadStudent;
