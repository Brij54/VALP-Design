// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import apiConfig from '../../config/apiConfig';
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeAlpine,
//   themeBalham
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from '@tanstack/react-query';

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface ColumnDef {
//   field: string;
//   headerName: string;
//   editable: boolean;
//   resizable: boolean;
//   sortable: boolean;
//   filter: boolean;
//   cellRenderer?: (params: any) => React.ReactNode;
// }

// // Define the custom cell renderer for the action column
// const ActionCellRenderer = (props:any) => {
//   const handleEdit = () => {
//     props.context.handleUpdate(props.data.id);
//   };

//   return (
//     <button onClick={handleEdit} className="btn btn-primary">
//       Edit
//     </button>
//   );
// };

// export type ResourceMetaData = {
//   "resource": string,
//   "fieldValues": any[]
// }
// const getCookie = (name: string): string | null => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//     return null;
//   };

//   const UpdateStudent = () => {
//    const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl('student')}?`
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Student')}?`
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//    const [currentUrl, setCurrentUrl] = useState('');
//     // Fetch resource data
//     const {data:dataRes,isLoading:isLoadingDataRes,error:errorDataRes}= useQuery({
//     queryKey: ['resourceData', 'student'],
//      queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);
//        const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     throw new Error("Access token not found");
//   }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl('student')}?` + params.toString(),
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${accessToken}`, // Add token here
//           },
//           credentials: "include", // include cookies if needed
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       setFetchedData(data.resource || []);
//        const initialEditedData = fetchData.reduce((acc: any, item: any) => {
//             acc[item.id] = { ...item };
//             return acc;
//              }, {});
//       return data;
//     },
//   })

//     // Fetch metadata
//     const {data: dataResMeta,isLoading:isLoadingDataResMeta,error:errorDataResMeta} = useQuery({
//     queryKey: ['resourceMetaData', 'student'],
//    queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl('student')}?`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);
//       const required = data[0]?.fieldValues
//         .filter((field: any) => !regex.test(field.name))
//         .map((field: any) => field.name);
//       setRequiredFields(required || []);
//       return data;
//     },
//   });

//     const handleEdit = (id: any, field: string, value: string) => {
//       setEditedData((prevData: any) => ({
//         ...prevData,
//         [id]: {
//           ...(prevData[id] || {}),
//           [field]: value,
//         },
//       }));
//     };

//     const handleUpdate = async (id: any) => {

//     navigate(`/edit/student/${id}`);
// };

//   useEffect(() => {
//     const data = fetchData || [];
//     const fields = requiredFields.filter(field => field !== 'id') || [];

//     const columns = fields.map(field => ({
//       field: field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true
//     }));

//     // Add the Action column with the custom cell renderer
//     columns.push({
//       headerName: 'Action',
//       field: 'Action',
//       cellRenderer: ActionCellRenderer,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 120
//     } as ColumnDef)
//     setColDef1(columns);
//     setRowData(data);
//   }, [fetchData, requiredFields]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

// return (
//     <div>

// <div className="">
//     {rowData.length === 0 && colDef1.length === 0 ? (
//       <div>No data available. Please add a resource attribute.</div>
//     ) : (
//       <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={colDef1}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={10}
//           animateRows={true}
//           rowSelection="multiple"
//           context={{
//             handleUpdate: handleUpdate
//           }}
//         />
//       </div>
//     )}
//   </div>

//   {showToast && (
//     <div
//       className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//       style={{ zIndex: 1550 }}
//     >
//       <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//         <div className="toast-header">
//           <strong className="me-auto">Success</strong>
//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="toast"
//             aria-label="Close"
//             onClick={() => setShowToast(false)}
//           ></button>
//         </div>
//         <div className="toast-body text-success text-center">Created successfully!</div>
//       </div>
//     </div>
// ) }

// </div>
// )

// };

// export default UpdateStudent

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

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

// const UpdateStudent = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<boolean>(false);
//   const [toastMessage, setToastMessage] = useState<string>("");
//   const navigate = useNavigate();
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
//       return data.resource || [];
//     },
//   });

//   // --- Enrich with Batch Name ---
//   useEffect(() => {
//     const enrichData = async () => {
//       const accessToken = getCookie("access_token");
//       if (!studentData?.length || !accessToken) return;

//       const enrichedRows = await Promise.all(
//         studentData.map(async (row: any) => {
//           try {
//             const params = new URLSearchParams({
//               queryId: "GET_NAME_BY_BATCH",
//             });
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
//               const batchRes = resources.find(
//                 (r: any) => r.name || r.batch_name
//               );
//               const batchName =
//                 batchRes?.name || batchRes?.batch_name || "Unknown";
//               return { ...row, batch_name: batchName };
//             }
//             return { ...row, batch_name: "Unknown" };
//           } catch (err) {
//             console.error("Error fetching batch name:", err);
//             return { ...row, batch_name: "Unknown" };
//           }
//         })
//       );

//       setRowData(enrichedRows);
//     };

//     enrichData();
//   }, [studentData]);

//   // --- Download Certificate ---
//   const handleDownload = async (documentId: string, userId: string) => {
//     const accessToken = getCookie("access_token");
//     try {
//       const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error(`Download failed: ${response.status}`);

//       // 🔹 Get file blob and MIME type
//       const blob = await response.blob();
//       const contentType = blob.type; // e.g. "application/pdf", "image/jpeg"

//       // 🔹 Try extracting filename from Content-Disposition header
//       const contentDisposition = response.headers.get("Content-Disposition");
//       let filename = "certificate";

//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="?([^"]+)"?/);
//         if (match && match[1]) filename = match[1];
//       } else {
//         // 🔹 If no header, infer extension from MIME type
//         const extensionMap: Record<string, string> = {
//           "application/pdf": "pdf",
//           "image/jpeg": "jpg",
//           "image/png": "png",
//         };
//         const ext = extensionMap[contentType] || "bin";
//         filename = `${documentId}.${ext}`;
//       }

//       // 🔹 Trigger browser download
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//     }
//   };

//   // --- Approve Student ---
//   const handleApprove = async (studentId: string) => {
//     try {
//       const accessToken = getCookie("access_token");

//       const params = new URLSearchParams({
//         resource: "student",
//         queryId: "APPROVE_STUDENT",
//         studentId: studentId,
//       });

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );

//       if (response.ok) {
//         setToastMessage("Certificate approved successfully!");
//         setShowToast(true);
//       } else {
//         console.error("Approve failed:", response.status);
//       }
//     } catch (err) {
//       console.error("Approve failed:", err);
//     }
//   };

//   // --- Reject Student ---
//   const handleReject = async (studentId: string) => {
//     try {
//       const accessToken = getCookie("access_token");

//       const params = new URLSearchParams({
//         resource: "student",
//         queryId: "REJECT_STUDENT",
//         studentId: studentId,
//       })
//       const response = await fetch(
//         `${apiConfig.getResourceUrl(
//           "student"
//         )}?${params.toString()}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );
//       if (response.ok) {
//         setToastMessage("Certificate rejected successfully!");
//         setShowToast(true);
//       }
//     } catch (err) {
//       console.error("Reject failed:", err);
//     }
//   };

//   // --- Define Columns ---
//   const colDefs1 = useMemo(() => {
//     return [
//       { headerName: "Roll No", field: "roll_no", sortable: true, filter: true },
//       { headerName: "Email", field: "email", sortable: true, filter: true },
//       {
//         headerName: "Course Name",
//         field: "course_name",
//         sortable: true,
//         filter: true,
//       },
//       {
//         headerName: "Platform",
//         field: "platform",
//         sortable: true,
//         filter: true,
//       },
//       {
//         headerName: "Course Duration",
//         field: "course_duration",
//         sortable: true,
//         filter: true,
//       },
//       {
//         headerName: "Batch",
//         field: "batch_name",
//         sortable: true,
//         filter: true,
//       },
//       {
//         headerName: "Upload Certificate",
//         field: "upload_certificate",
//         cellRenderer: (params: any) => {
//           const documentId = params.value;
//           const userId = params.data.user_id;
//           return documentId ? (
//             <button
//               onClick={() => handleDownload(documentId, userId)}
//               className="btn btn-sm btn-primary"
//             >
//               View Certificate
//             </button>
//           ) : (
//             <span className="text-muted">No Certificate</span>
//           );
//         },
//       },
//       {
//         headerName: "Actions",
//         field: "actions",
//         cellRenderer: (params: any) => (
//           <div className="d-flex gap-2">
//             <button
//               onClick={() => handleApprove(params.data.id)}
//               className="btn btn-success btn-sm"
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => handleReject(params.data.id)}
//               className="btn btn-danger btn-sm"
//             >
//               Reject
//             </button>
//           </div>
//         ),
//       },
//     ];
//   }, []);

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
//           <div
//             className="toast show"
//             role="alert"
//             aria-live="assertive"
//             aria-atomic="true"
//           >
//             <div className="toast-header">
//               <strong className="me-auto">Action Status</strong>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setShowToast(false)}
//               ></button>
//             </div>
//             <div className="toast-body text-success text-center">
//               {toastMessage}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateStudent;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import apiConfig from '../../config/apiConfig';
// import {
//   AllCommunityModule,
//   ModuleRegistry,
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from '@tanstack/react-query';

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface ColumnDef {
//   field: string;
//   headerName: string;
//   editable: boolean;
//   resizable: boolean;
//   sortable: boolean;
//   filter: boolean;
//   cellRenderer?: (params: any) => React.ReactNode;
// }

// // Custom Action Cell Renderer
// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => {
//     props.context.handleUpdate(props.data.id);
//   };

//   return (
//     <button onClick={handleEdit} className="btn btn-primary btn-sm">
//       Edit
//     </button>
//   );
// };

// // Helper to get cookie
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const UpdateStudent = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<ColumnDef[]>([]);
//   const [showToast, setShowToast] = useState(false);

//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const regex = /^(g_|archived|extra_data)/;

//   // Fetch students data
//   const { data: dataRes, isFetching } = useQuery({
//     queryKey: ['resourceData', 'student'],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       params.append("queryId", "GET_ALL");

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token not found");

//       const response = await fetch(`${apiConfig.getResourceUrl('student')}?${params.toString()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Error: " + response.status);

//       return await response.json();
//     },
//     refetchOnWindowFocus: true, // automatically refresh when returning to page
//   });

//   // Navigate to edit page
//   const handleUpdate = (id: any) => {
//     navigate(`/edit/student/${id}`);
//   };

//   // Status badge (supports boolean or string)
//   const getStatusBadge = (status: any) => {
//     if (status === "Approved" || status === true)
//       return <span className="badge bg-success text-white">✅ Approved</span>;
//     if (status === "Rejected" || status === false)
//       return <span className="badge bg-danger text-white">❌ Rejected</span>;
//     return <span className="badge bg-secondary text-white">⏳ Pending</span>;
//   };

//   // Update a row locally after edit
//   const updateRowData = (updatedStudent: any) => {
//     setRowData(prev => prev.map(row =>
//       row.id === updatedStudent.id ? updatedStudent : row
//     ));
//     setShowToast(true);
//   };

//   // Setup columns when data changes
//   useEffect(() => {
//     if (!dataRes) return;

//     const students = dataRes.resource || [];
//     setRowData(students);

//     if (students.length === 0) return;

//     const fieldsToUse = Object.keys(students[0]).filter(
//       key => !regex.test(key) && key !== "id"
//     );

//     const columns: ColumnDef[] = fieldsToUse.map(field => ({
//       field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true,
//       cellRenderer: field === "status" ? (params: any) => getStatusBadge(params.value) : undefined,
//     }));

//     columns.push({
//       headerName: "Action",
//       field: "action",
//       cellRenderer: ActionCellRenderer,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       // width: 120,
//     });

//     setColDef1(columns);
//   }, [dataRes]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   if (isFetching) return <div>Loading...</div>;

//   return (
//     <div>
//       {rowData.length === 0 && colDef1.length === 0 ? (
//         <div>No data available. Please add a resource attribute.</div>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={colDef1}
//             defaultColDef={defaultColDef}
//             pagination
//             paginationPageSize={10}
//             animateRows
//             rowSelection="multiple"
//             context={{ handleUpdate }}
//           />
//         </div>
//       )}

//       {/* Toast */}
//       {showToast && (
//         <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 9999 }}>
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
//             </div>
//             <div className="toast-body text-success text-center">
//               Updated successfully!
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateStudent;


// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from "react-router-dom";
// import apiConfig from '../../config/apiConfig';
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from '@tanstack/react-query';

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface Student {
//   id: string;
//   email: string;
//   batch: string;
//   user_id?: string;
//   status?: boolean | string;
//   upload_certificate?: string;
//   batch_name?: string;
//   [key: string]: any;
// }

// interface ColumnDef {
//   field: string;
//   headerName: string;
//   editable: boolean;
//   resizable: boolean;
//   sortable: boolean;
//   filter: boolean;
//   cellRenderer?: (params: any) => React.ReactNode;
// }

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const UpdateStudent: React.FC = () => {
//   const [rowData, setRowData] = useState<Student[]>([]);
//   const [showToast, setShowToast] = useState(false);

//   const navigate = useNavigate();
//   const regex = /^(g_|archived|extra_data)/;

//   // --- Fetch students data ---
//   const { data: dataRes, isFetching } = useQuery({
//     queryKey: ['resourceData', 'student'],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       params.append("queryId", "GET_ALL");

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token not found");

//       const response = await fetch(`${apiConfig.getResourceUrl('student')}?${params.toString()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Error: " + response.status);

//       return await response.json();
//     },
//     refetchOnWindowFocus: true,
//   });

//   // --- Status badge ---
//   const getStatusBadge = (status: any) => {
//     if (status === "Approved" || status === true)
//       return <span className="badge bg-success text-white">✅ Approved</span>;
//     if (status === "Rejected" || status === false)
//       return <span className="badge bg-danger text-white">❌ Rejected</span>;
//     return <span className="badge bg-secondary text-white">⏳ Pending</span>;
//   };

//   // --- Enrich student data with batch_name ---
//   useEffect(() => {
//     if (!dataRes) return;

//     const fetchBatchNames = async () => {
//       const students: Student[] = dataRes.resource || [];
//       const accessToken = getCookie("access_token");
//       if (!accessToken) return;

//       const batchMap: Record<string, string> = {};
//       const uniqueBatches = Array.from(new Set(students.map(s => s.batch)));

//       await Promise.all(uniqueBatches.map(async (batch) => {
//         try {
//           const params = new URLSearchParams({ queryId: "GET_NAME_BY_BATCH" });
//           params.append("args", `batch:${batch}`);

//           const response = await fetch(`${apiConfig.getResourceUrl("student")}?${params.toString()}`, {
//             headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
//             credentials: "include",
//           });

//           if (response.ok) {
//             const data = await response.json();
//             const resources = data.resource || [];
//             const batchRes = resources.find((r: any) => r.name || r.batch_name);
//             batchMap[batch] = batchRes?.name || batchRes?.batch_name || "Unknown";
//           } else {
//             batchMap[batch] = "Unknown";
//           }
//         } catch (err) {
//           console.error("Error fetching batch:", err);
//           batchMap[batch] = "Unknown";
//         }
//       }));

//       const enrichedRows = students.map(student => ({
//         ...student,
//         batch_name: batchMap[student.batch] || "Unknown"
//       }));

//       setRowData(enrichedRows);
//     };

//     fetchBatchNames();
//   }, [dataRes]);

//   // --- Define columns ---
//   const colDef1: ColumnDef[] = useMemo(() => {
//     if (!rowData.length) return [];

//     const fieldsToUse = Object.keys(rowData[0])
//       .filter(key => !regex.test(key) && key !== "id" && key !== "user_id");

//     const cols: ColumnDef[] = fieldsToUse.map(field => {
//       if (field === "status") 
//         return { field, headerName: "Status", editable: false, resizable: true, sortable: true, filter: true, cellRenderer: (params) => getStatusBadge(params.value) };

//       if (field === "upload_certificate") {
//         return {
//           field,
//           headerName: "Upload Certificate",
//           editable: false,
//           resizable: true,
//           sortable: true,
//           filter: true,
//           cellRenderer: (params: any) => {
//             const documentId = params.value;
//             const userId = params.data.user_id;
//             const handleDownload = async (e: any) => {
//               e.stopPropagation();
//               const accessToken = getCookie("access_token");
//               try {
//                 const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;
//                 const response = await fetch(url, {
//                   method: "GET",
//                   headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
//                   credentials: "include",
//                 });
//                 if (!response.ok) throw new Error(`Download failed: ${response.status}`);
//                 const blob = await response.blob();
//                 const downloadUrl = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = downloadUrl;
//                 const filename =
//                   response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/['"]/g, "") || "downloaded_file";
//                 a.download = filename;
//                 document.body.appendChild(a);
//                 a.click();
//                 a.remove();
//                 window.URL.revokeObjectURL(downloadUrl);
//               } catch (error) {
//                 console.error("Error downloading file:", error);
//               }
//             };
//             return <button onClick={handleDownload} style={{ backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>Download</button>;
//           }
//         };
//       }

//       return { field, headerName: field, editable: false, resizable: true, sortable: true, filter: true };
//     });

//     // --- Insert batch_name right after email ---
//     if (!cols.find(c => c.field === "batch_name")) {
//       const emailIndex = cols.findIndex(c => c.field === "email");
//       const batchCol = { headerName: "Batch", field: "batch_name", editable: false, resizable: true, sortable: true, filter: true };
//       if (emailIndex >= 0) cols.splice(emailIndex + 1, 0, batchCol);
//       else cols.push(batchCol);
//     }

//     // Action column
//     cols.push({
//       headerName: "Action",
//       field: "action",
//       cellRenderer: (params: any) => <button className="btn btn-primary btn-sm" onClick={() => navigate(`/edit/student/${params.data.id}`)}>Edit</button>,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//     });

//     return cols;
//   }, [rowData]);

//   const defaultColDef = { flex: 1, minWidth: 100, editable: false };

//   if (isFetching) return <div>Loading...</div>;

//   return (
//     <div>
//       {rowData.length === 0 ? (
//         <div>No student data available.</div>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={colDef1}
//             defaultColDef={defaultColDef}
//             pagination
//             paginationPageSize={10}
//             animateRows
//           />
//         </div>
//       )}

//       {showToast && (
//         <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 9999 }}>
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
//             </div>
//             <div className="toast-body text-success text-center">Updated successfully!</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateStudent;


import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import apiConfig from '../../config/apiConfig';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from '@tanstack/react-query';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Student {
  id: string;
  email: string;
  batch: string;
  user_id?: string;
  status?: boolean | string;
  upload_certificate?: string;
  batch_name?: string;
  [key: string]: any;
}

interface ColumnDef {
  field: string;
  headerName: string;
  editable: boolean;
  resizable: boolean;
  sortable: boolean;
  filter: boolean;
  cellRenderer?: (params: any) => React.ReactNode;
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const UpdateStudent: React.FC = () => {
  const [rowData, setRowData] = useState<Student[]>([]);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const regex = /^(g_|archived|extra_data)/;

  // --- Fetch students data ---
  const { data: dataRes, isFetching } = useQuery({
    queryKey: ['resourceData', 'student'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(`${apiConfig.getResourceUrl('student')}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error: " + response.status);
      return await response.json();
    },
    refetchOnWindowFocus: true,
  });

  // --- Status badge ---
  const getStatusBadge = (status: any) => {
    if (status === "Approved" || status === true)
      return <span className="badge bg-success text-white">✅ Approved</span>;
    if (status === "Rejected" || status === false)
      return <span className="badge bg-danger text-white">❌ Rejected</span>;
    return <span className="badge bg-secondary text-white">⏳ Pending</span>;
  };

  // --- Enrich student data with batch_name ---
  useEffect(() => {
    if (!dataRes) return;

    const fetchBatchNames = async () => {
      const students: Student[] = dataRes.resource || [];
      const accessToken = getCookie("access_token");
      if (!accessToken) return;

      const batchMap: Record<string, string> = {};
      const uniqueBatches = Array.from(new Set(students.map(s => s.batch)));

      await Promise.all(uniqueBatches.map(async (batch) => {
        try {
          const params = new URLSearchParams({ queryId: "GET_NAME_BY_BATCH" });
          params.append("args", `batch:${batch}`);

          const response = await fetch(`${apiConfig.getResourceUrl("student")}?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            const resources = data.resource || [];
            const batchRes = resources.find((r: any) => r.name || r.batch_name);
            batchMap[batch] = batchRes?.name || batchRes?.batch_name || "Unknown";
          } else {
            batchMap[batch] = "Unknown";
          }
        } catch (err) {
          console.error("Error fetching batch:", err);
          batchMap[batch] = "Unknown";
        }
      }));

      const enrichedRows = students.map(student => ({
        ...student,
        batch_name: batchMap[student.batch] || "Unknown"
      }));

      setRowData(enrichedRows);
    };

    fetchBatchNames();
  }, [dataRes]);

  // --- Define columns ---
  const colDef1: ColumnDef[] = useMemo(() => {
    if (!rowData.length) return [];

    const fieldsToUse = Object.keys(rowData[0])
      // 🧹 Remove batch so it doesn’t appear
      .filter(key => !regex.test(key) && key !== "id" && key !== "user_id" && key !== "batch");

    const cols: ColumnDef[] = fieldsToUse.map(field => {
      if (field === "status") 
        return { field, headerName: "Status", editable: false, resizable: true, sortable: true, filter: true, cellRenderer: (params) => getStatusBadge(params.value) };

      if (field === "upload_certificate") {
        return {
          field,
          headerName: "Upload Certificate",
          editable: false,
          resizable: true,
          sortable: true,
          filter: true,
          cellRenderer: (params: any) => {
            const documentId = params.value;
            const userId = params.data.user_id;
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
                  response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/['"]/g, "") || "downloaded_file";
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
              } catch (error) {
                console.error("Error downloading file:", error);
              }
            };
            return <button onClick={handleDownload} style={{ backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>Download</button>;
          }
        };
      }

      return { field, headerName: field, editable: false, resizable: true, sortable: true, filter: true };
    });

    // --- Insert batch_name right after email ---
    if (!cols.find(c => c.field === "batch_name")) {
      const emailIndex = cols.findIndex(c => c.field === "email");
      const batchCol = { 
        headerName: "Batch Name", 
        field: "batch_name", 
        editable: false, 
        resizable: true, 
        sortable: true, 
        filter: true 
      };
      if (emailIndex >= 0) cols.splice(emailIndex + 1, 0, batchCol);
      else cols.push(batchCol);
    }

    // Action column
    cols.push({
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => <button className="btn btn-primary btn-sm" onClick={() => navigate(`/edit/student/${params.data.id}`)}>Edit</button>,
      editable: false,
      resizable: true,
      sortable: false,
      filter: false,
    });

    return cols;
  }, [rowData]);

  const defaultColDef = { flex: 1, minWidth: 100, editable: false };

  if (isFetching) return <div>Loading...</div>;

  return (
    <div>
      {rowData.length === 0 ? (
        <div>No student data available.</div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDef1}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            animateRows
          />
        </div>
      )}

      {showToast && (
        <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 9999 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
            </div>
            <div className="toast-body text-success text-center">Updated successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateStudent;
