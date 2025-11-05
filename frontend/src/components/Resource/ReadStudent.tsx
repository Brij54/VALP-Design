import React, { useState, useEffect } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import StudentModel from "../../models/StudentModel";

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
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);

  const regex = /^(g_|archived|extra_data)/;

  // --- Fetch Student Data ---
  const { data: dataRes } = useQuery({
    queryKey: ["resourceData", "student"],
    queryFn: async () => {
      const params = new URLSearchParams();
      const queryId: any = "GET_ALL";
      params.append("queryId", queryId);

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${apiConfig.getResourceUrl("student")}?` + params.toString(),
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
    },
  });

  // --- Fetch Metadata ---
  const { data: dataResMeta } = useQuery({
    queryKey: ["resourceMetaData", "student"],
    queryFn: async () => {
      const response = await fetch(
        `${apiConfig.getResourceMetaDataUrl("student")}?`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      setResMetaData(data);
      setFields(data[0]?.fieldValues || []);

      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);
      setRequiredFields(required || []);

      return data;
    },
  });

  // --- Transform fetched data into model format ---
  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      const modelObjects = fetchData.map((obj: any) =>
        StudentModel.fromJson(obj)
      );
      const jsonObjects = modelObjects.map((model: any) => model.toJson());
      setRowData(jsonObjects);
    }
  }, [fetchData]);

  // --- Define Columns for AG Grid ---
  useEffect(() => {
    const fields = requiredFields.filter((field: any) => field !== "id") || [];

    const columns = fields.map((field: any) => {
      // ✅ Custom Renderer for Upload Certificate column
      if (field === "upload_certificate") {
        return {
          field: field,
          headerName: "Upload Certificate",
          resizable: true,
          sortable: true,
          filter: true,
          width: 160,
          cellRenderer: (params: any) => {
            const documentId = params.value;
            const userId = params.data.user_id;

            if (!documentId) {
              return <span style={{ color: "#888" }}>No file</span>;
            }

            const handleDownload = async (e: any) => {
              e.stopPropagation();
              const accessToken = getCookie("access_token"); // 👈 fetch token

              try {
                const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;

                const response = await fetch(url, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  credentials: "include",
                });

                if (!response.ok) {
                  throw new Error(`Download failed: ${response.status}`);
                }

                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = downloadUrl;

                const contentDisposition = response.headers.get(
                  "Content-Disposition"
                );
                const filename =
                  contentDisposition
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

      // Default columns
      return {
        field: field,
        headerName: field,
        editable: false,
        resizable: true,
        sortable: true,
        filter: true,
      };
    });

    setColDef1(columns);
  }, [fetchData, requiredFields]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  };

  return (
    <div>
      <div>
        {rowData.length === 0 && colDef1.length === 0 ? (
          <div>No data available. Please add a resource attribute.</div>
        ) : (
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={colDef1}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              rowSelection="multiple"
            />
          </div>
        )}
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
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
