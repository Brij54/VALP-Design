// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const Edit = () => {
//   const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Student");
//   const apiUrl = `${apiConfig.getResourceUrl("Student")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});
//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Add token here
//       },
//       credentials: "include", // include cookies if needed
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     return data;
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Student"
//   );

//   useEffect(() => {
//     // console.log()

//     if (fetchDataById.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById["resource"][0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//       console.log(
//         "fetched data by ID",
//         fetchedDataById,
//         loadingEditComp,
//         editedRecord
//       );
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   const {
//     data: metaData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["resMetaData"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch metadata: ${res.statusText}`);
//       }

//       const data = await res.json();

//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       const foreignFields = data[0].fieldValues.filter(
//         (field: any) => field.foreign
//       );
//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           await fetchForeignData(
//             field.foreign,
//             field.name,
//             field.foreign_field
//           );
//         }
//       }

//       const enumFields = data[0].fieldValues.filter(
//         (field: any) => field.isEnum === true
//       );
//       for (const field of enumFields) {
//         if (!fetchedEnum.current.has(field.possible_value)) {
//           fetchedEnum.current.add(field.possible_value);

//           queryClient.prefetchQuery({
//             queryKey: ["enum", field.possible_value],
//             queryFn: () => fetchEnum(field.possible_value),
//           });

//           await fetchEnumData(field.possible_value);
//         }
//       }

//       return data;
//     },
//   });

//   // ✅ async function, not useQuery
//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev) => ({
//         ...prev,
//         [enumName]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   // ✅ async function, not useQuery
//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({
//         ...prev,
//         [foreignResource]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   const handleEdit = (id: any, field: string, value: string) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };
//   const base64EncodeFun = (str: string) => {
//     return btoa(unescape(encodeURIComponent(str)));
//   };

//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();
//     if (editedRecord.length === 0) return;

//     const jsonString = JSON.stringify(editedRecord);

//     const base64Encoded = base64EncodeFun(jsonString);

//     const params = new URLSearchParams();

//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");
//     const accessToken = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     try {
//       const response = await fetch(apiUrl + params.toString(), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Bearer ${accessToken}`, // Add token here
//         },
//         credentials: "include", // include cookies if needed
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//       } else {
//         console.error("Error updating record:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error in handleUpdate:", error);
//     }
//   };

//   return (
//     <>
//       {!loadingEditComp && (
//         <div className="container mt-4">
//           <form>
//             <div
//               id="id-1"
//               className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
//             >
//               <div className="border-0 fw-bold fs-3" id="id-3">
//                 Student
//               </div>
//               <div id="id-5" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-7">
//                   roll_no *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="roll_no"
//                   id="id-89"
//                 />
//               </div>
//               <div id="id-B" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-D">
//                   email *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="email"
//                   id="id-8F"
//                 />
//               </div>
//               <div id="id-H" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-J">
//                   course_name *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="course_name"
//                   id="id-8L"
//                 />
//               </div>
//               <div id="id-N" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-P">
//                   course_url
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="course_url"
//                   id="id-8R"
//                 />
//               </div>
//               <div id="id-T" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-V">
//                   course_duration *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="course_duration"
//                   id="id-8X"
//                 />
//               </div>
//               <div id="id-Z" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-11">
//                   platform *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="platform"
//                   id="id-93"
//                 />
//               </div>
//               <div id="id-15" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-17">
//                   course_completion_date *
//                 </div>
//                 <input
//                   className="form-control"
//                   placeholder="course_completion_date"
//                   id="id-99"
//                 />
//               </div>
//               <div id="id-1B" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-1D">
//                   upload_certificate *
//                 </div>
//                 <div className="mb-3" id="id-1F">
//                   <label className="form-label">
//                     Upload file for upload_certificate{" "}
//                   </label>
//                   <input className="form-control" type="file" id="formFile" />
//                 </div>
//               </div>
//               <div id="id-1H" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-1J">
//                   batch *
//                 </div>
//                 <div className="dropdown">
//                   <button
//                     className="btn btn-secondary dropdown-toggle "
//                     type="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                     id="id-1L"
//                   >
//                     batch
//                   </button>
//                   <ul className="dropdown-menu"></ul>
//                 </div>
//               </div>
//               <div id="id-1N" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-1P">
//                   course_mode *
//                 </div>
//                 <div className="dropdown">
//                   <button
//                     className="btn btn-secondary dropdown-toggle "
//                     type="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                     id="id-1R"
//                   >
//                     course_mode
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <a className="dropdown-item" href="#" id="0">
//                         Course_mode
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div id="id-1T" className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold" id="id-1V">
//                   user_id *
//                 </div>
//                 <div className="dropdown">
//                   <button
//                     className="btn btn-secondary dropdown-toggle "
//                     type="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                     id="id-1X"
//                   >
//                     user_id
//                   </button>
//                   <ul className="dropdown-menu"></ul>
//                 </div>
//               </div>
//               <button
//                 className="btn btn-success"
//                 id="id-1Z"
//                 onClick={(e) => handleUpdate(id, e)}
//               >
//                 Submit
//               </button>
//             </div>
//           </form>

//           {showToast && (
//             <div
//               className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//               style={{ zIndex: 1550 }}
//             >
//               <div
//                 className="toast show"
//                 role="alert"
//                 aria-live="assertive"
//                 aria-atomic="true"
//               >
//                 <div className="toast-header">
//                   <strong className="me-auto">Success</strong>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowToast(false)}
//                   ></button>
//                 </div>
//                 <div className="toast-body text-success text-center">
//                   Updated successfully!
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Edit;


// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const Edit = () => {
//   const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Student");
//   const apiUrl = `${apiConfig.getResourceUrl("Student")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
//   const [enums, setEnums] = useState<Record<string, any[]>>({});
//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // ✅ Fetch data by ID
//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     return data;
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Student"
//   );

//   // ✅ When fetched data is available, set editedRecord
//   useEffect(() => {
//     if (fetchedDataById && fetchedDataById["resource"]?.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById["resource"][0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//       console.log("Fetched Student Data:", fetchedDataById["resource"][0]);
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   // ✅ For debugging
//   useEffect(() => {
//     console.log("Edited Record (current):", editedRecord);
//   }, [editedRecord]);

//   // ✅ Fetch metadata for enums and foreign keys (optional if needed)
//   useQuery({
//     queryKey: ["resMetaDataStudent"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch metadata: ${res.statusText}`);
//       }

//       const data = await res.json();
//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);

//       const foreignFields = data[0]?.fieldValues?.filter((f: any) => f.foreign) || [];
//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);
//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });
//           await fetchForeignData(field.foreign, field.name, field.foreign_field);
//         }
//       }

//       const enumFields = data[0]?.fieldValues?.filter((f: any) => f.isEnum === true) || [];
//       for (const field of enumFields) {
//         if (!fetchedEnum.current.has(field.possible_value)) {
//           fetchedEnum.current.add(field.possible_value);
//           queryClient.prefetchQuery({
//             queryKey: ["enum", field.possible_value],
//             queryFn: () => fetchEnum(field.possible_value),
//           });
//           await fetchEnumData(field.possible_value);
//         }
//       }

//       return data;
//     },
//   });

//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev) => ({
//         ...prev,
//         [enumName]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({
//         ...prev,
//         [foreignResource]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   // ✅ Handle field edit
//   const handleEdit = (field: string, value: string) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const base64EncodeFun = (str: string) => {
//     return btoa(unescape(encodeURIComponent(str)));
//   };

//   // ✅ Handle update
//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editedRecord || Object.keys(editedRecord).length === 0) return;

//     const jsonString = JSON.stringify(editedRecord);
//     const base64Encoded = base64EncodeFun(jsonString);

//     const params = new URLSearchParams();
//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");
//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     try {
//       const response = await fetch(apiUrl + params.toString(), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         credentials: "include",
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//       } else {
//         console.error("Error updating record:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error in handleUpdate:", error);
//     }
//   };

//   return (
//     <>
//       {!loadingEditComp && (
//         <div className="container mt-4">
//           <form>
//             <div className="d-flex flex-column border border-2 p-2 gap-2 mb-2">
//               <div className="border-0 fw-bold fs-3">Student</div>

//               {/* roll_no */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">roll_no *</div>
//                 <input
//                   className="form-control"
//                   placeholder="roll_no"
//                   name="roll_no"
//                   value={editedRecord.roll_no || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* email */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">email *</div>
//                 <input
//                   className="form-control"
//                   placeholder="email"
//                   name="email"
//                   value={editedRecord.email || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* course_name */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">course_name *</div>
//                 <input
//                   className="form-control"
//                   placeholder="course_name"
//                   name="course_name"
//                   value={editedRecord.course_name || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* course_url */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">course_url</div>
//                 <input
//                   className="form-control"
//                   placeholder="course_url"
//                   name="course_url"
//                   value={editedRecord.course_url || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* course_duration */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">course_duration *</div>
//                 <input
//                   className="form-control"
//                   placeholder="course_duration"
//                   name="course_duration"
//                   value={editedRecord.course_duration || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* platform */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">platform *</div>
//                 <input
//                   className="form-control"
//                   placeholder="platform"
//                   name="platform"
//                   value={editedRecord.platform || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* course_completion_date */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">course_completion_date *</div>
//                 <input
//                   className="form-control"
//                   placeholder="course_completion_date"
//                   name="course_completion_date"
//                   value={editedRecord.course_completion_date || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* batch */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">batch *</div>
//                 <input
//                   className="form-control"
//                   placeholder="batch"
//                   name="batch"
//                   value={editedRecord.batch || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* course_mode */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">course_mode *</div>
//                 <input
//                   className="form-control"
//                   placeholder="course_mode"
//                   name="course_mode"
//                   value={editedRecord.course_mode || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* user_id */}
//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold">user_id *</div>
//                 <input
//                   className="form-control"
//                   placeholder="user_id"
//                   name="user_id"
//                   value={editedRecord.user_id || ""}
//                   onChange={(e) => handleEdit(e.target.name, e.target.value)}
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 className="btn btn-success"
//                 onClick={(e) => handleUpdate(id, e)}
//               >
//                 Submit
//               </button>
//             </div>
//           </form>

//           {/* ✅ Toast */}
//           {showToast && (
//             <div
//               className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//               style={{ zIndex: 1550 }}
//             >
//               <div
//                 className="toast show"
//                 role="alert"
//                 aria-live="assertive"
//                 aria-atomic="true"
//               >
//                 <div className="toast-header">
//                   <strong className="me-auto">Success</strong>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowToast(false)}
//                   ></button>
//                 </div>
//                 <div className="toast-body text-success text-center">
//                   Updated successfully!
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Edit;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Edit = () => {
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Student");
  const apiUrl = `${apiConfig.getResourceUrl("Student")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ✅ Fetch data by ID
  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id && !!resourceName,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
    id,
    "Student"
  );

  // ✅ When fetched data is available, set editedRecord
  useEffect(() => {
    if (
      fetchedDataById &&
      fetchedDataById["resource"]?.length > 0 &&
      !loadingEditComp
    ) {
      const record = Object.fromEntries(
        Object.entries(fetchedDataById["resource"][0]).filter(
          ([key]) => !regex.test(key)
        )
      );
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...record,
        status:
          record.status === true
            ? "Approved"
            : record.status === false
            ? "Rejected"
            : "Pending",
      }));
      console.log("Fetched Student Data:", record);
    }
  }, [fetchedDataById, loadingEditComp]);

  // ✅ Handle field edit
  const handleEdit = (field: string, value: string) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // ✅ Handle status change
  const handleStatusChange = (value: string) => {
    setEditedRecord((prev: any) => ({
      ...prev,
      status: value,
    }));
  };

  const base64EncodeFun = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // ✅ Handle update
  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (!editedRecord || Object.keys(editedRecord).length === 0) return;

    // Convert readable status to boolean for backend
    let statusValue: boolean | null = null;
    if (editedRecord.status === "Approved") statusValue = true;
    else if (editedRecord.status === "Rejected") statusValue = false;

    const recordToSend = {
      ...editedRecord,
      status: statusValue,
    };

    const jsonString = JSON.stringify(recordToSend);
    const base64Encoded = base64EncodeFun(jsonString);

    const params = new URLSearchParams();
    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    try {
      const response = await fetch(apiUrl + params.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  // ✅ Status color mapping
  const getStatusBadge = (status: string) => {
    if (status === "Approved")
      return (
        <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
          ✅ <span>Approved</span>
        </span>
      );
    if (status === "Rejected")
      return (
        <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
          ❌ <span>Rejected</span>
        </span>
      );
    return (
      <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
        ⏳ <span>Pending</span>
      </span>
    );
  };

  return (
    <>
      {!loadingEditComp && (
        <div className="container mt-4">
          <form>
            <div className="d-flex flex-column border border-2 p-2 gap-2 mb-2">
              <div className="border-0 fw-bold fs-3">Student</div>

              {/* Roll No */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">roll_no *</div>
                <input
                  className="form-control"
                  name="roll_no"
                  value={editedRecord.roll_no || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">email *</div>
                <input
                  className="form-control"
                  name="email"
                  value={editedRecord.email || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Course Name */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">course_name *</div>
                <input
                  className="form-control"
                  name="course_name"
                  value={editedRecord.course_name || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Duration */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">course_duration *</div>
                <input
                  className="form-control"
                  name="course_duration"
                  value={editedRecord.course_duration || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Platform */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">platform *</div>
                <input
                  className="form-control"
                  name="platform"
                  value={editedRecord.platform || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Completion Date */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">course_completion_date *</div>
                <input
                  className="form-control"
                  name="course_completion_date"
                  value={editedRecord.course_completion_date || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Batch */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">batch *</div>
                <input
                  className="form-control"
                  name="batch"
                  value={editedRecord.batch || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* Course Mode */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">course_mode *</div>
                <input
                  className="form-control"
                  name="course_mode"
                  value={editedRecord.course_mode || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* User ID */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold">user_id *</div>
                <input
                  className="form-control"
                  name="user_id"
                  value={editedRecord.user_id || ""}
                  onChange={(e) => handleEdit(e.target.name, e.target.value)}
                />
              </div>

              {/* ✅ Status Field */}
              <div className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold mb-1">status *</div>
                <div className="d-flex align-items-center">
                  <select
                    className="form-select w-auto"
                    name="status"
                    value={editedRecord.status || "Pending"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {getStatusBadge(editedRecord.status)}
                </div>
              </div>

              {/* Submit */}
              <button
                className="btn btn-success mt-3"
                onClick={(e) => handleUpdate(id, e)}
              >
                Submit
              </button>
            </div>
          </form>

          {/* ✅ Toast */}
          {showToast && (
            <div
              className="toast-container position-fixed top-20 start-50 translate-middle p-3"
              style={{ zIndex: 1550 }}
            >
              <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                  <strong className="me-auto">Success</strong>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowToast(false)}
                  ></button>
                </div>
                <div className="toast-body text-success text-center">
                  Updated successfully!
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Edit;
