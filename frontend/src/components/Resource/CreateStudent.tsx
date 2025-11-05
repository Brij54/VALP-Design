import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const CreateStudent = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("Student");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Student");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ✅ async function, not useQuery
  const fetchForeignData = async (
    foreignResource: string,
    fieldName: string,
    foreignField: string
  ) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({
        ...prev,
        [foreignResource]: data,
      }));
    } catch (err) {
      console.error(`Error fetching foreign data for ${fieldName}:`, err);
    }
  };

  // ✅ async function, not useQuery
  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({
        ...prev,
        [enumName]: data,
      }));
    } catch (err) {
      console.error(`Error fetching enum data for ${enumName}:`, err);
    }
  };

  // ✅ useQuery only here
  const {
    data: metaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);
      }

      const data = await res.json();

      setResMetaData(data);
      setFields(data[0].fieldValues);

      const foreignFields = data[0].fieldValues.filter(
        (field: any) => field.foreign
      );
      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(
            field.foreign,
            field.name,
            field.foreign_field
          );
        }
      }

      const enumFields = data[0].fieldValues.filter(
        (field: any) => field.isEnum === true
      );
      for (const field of enumFields) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);

          queryClient.prefetchQuery({
            queryKey: ["enum", field.possible_value],
            queryFn: () => fetchEnum(field.possible_value),
          });

          await fetchEnumData(field.possible_value);
        }
      }

      return data;
    },
  });

  useEffect(() => {
    console.log("data to save", dataToSave);
  }, [dataToSave]);

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const selectedFile = dataToSave.upload_certificate;
    dataToSave.upload_certificate="";
    // delete dataToSave.upload_certif
    const formData = new FormData();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    formData.append("resource",base64Encoded);
    console.log("data while saving",jsonString)
     formData.append("description","my description")
    formData.append("appId", "hostel_management_system");
    formData.append("dmsRole", "admin");
    formData.append("user_id", "admin@rasp.com");
    formData.append("tags", "t1,t2, attend");
    const accessToken = getCookie("access_token");
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    // params.append("resource", base64Encoded);
    // params.append("file")
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token here
      },
      credentials: "include", // include cookies if needed
      body:formData
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div>
      <div>
        <div
          id="id-1"
          className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
        >
          <div className="border-0 fw-bold fs-3" id="id-3">
            Student
          </div>
          <div className="border-0 fw-bold" id="id-7">
            roll_no *
          </div>
          <input
            type="text"
            className="form-control"
            name="roll_no"
            required={true}
            value={dataToSave["roll_no"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["roll_no"]: e.target.value })
            }
          />
          <div className="border-0 fw-bold" id="id-D">
            email *
          </div>
          <input
            type="text"
            className="form-control"
            name="email"
            required={true}
            value={dataToSave["email"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["email"]: e.target.value })
            }
          />
          <div className="border-0 fw-bold" id="id-J">
            course_name *
          </div>
          <input
            type="text"
            className="form-control"
            name="course_name"
            required={true}
            value={dataToSave["course_name"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["course_name"]: e.target.value })
            }
          />
          <div className="border-0 fw-bold" id="id-P">
            course_url
          </div>
          <input
            type="text"
            className="form-control"
            name="course_url"
            required={false}
            value={dataToSave["course_url"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["course_url"]: e.target.value })
            }
          />
          <div className="border-0 fw-bold" id="id-V">
            course_duration *
          </div>
          <input
            type="text"
            className="form-control"
            name="course_duration"
            required={true}
            value={dataToSave["course_duration"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                ["course_duration"]: e.target.value,
              })
            }
          />
          <div className="border-0 fw-bold" id="id-11">
            platform *
          </div>
          <input
            type="text"
            className="form-control"
            name="platform"
            required={true}
            value={dataToSave["platform"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["platform"]: e.target.value })
            }
          />
          <div className="border-0 fw-bold" id="id-17">
            course_completion_date *
          </div>
          <input
            type="text"
            className="form-control"
            name="course_completion_date"
            required={true}
            value={dataToSave["course_completion_date"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                ["course_completion_date"]: e.target.value,
              })
            }
          />
          <div className="border-0 fw-bold" id="id-1D">
            upload_certificate *
          </div>
          <div className="mb-3" id="id-1F">
            <label className="form-label">
              Upload file for upload_certificate{" "}
            </label>
            <input
              className="form-control"
              type="file"
              name="upload_certificate"
              required={true}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  ["upload_certificate"]: e.target.files?.[0] || null,
                })
              }
            />
          </div>
          <div className="border-0 fw-bold" id="id-1J">
            batch *
          </div>
          {(() => {
            const options = foreignKeyData["Batch"] || [];
            const filteredOptions = options.filter((option) =>
              option["id"]
                ?.toLowerCase()
                .includes((searchQueries["batch"] || "").toLowerCase())
            );
            return (
              <>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id={`dropdownMenu-${"batch"}`}
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {" "}
                  {dataToSave["batch"]
                    ? options.find(
                        (item) => item["batch_name"] === dataToSave["batch"]
                      )?.["batch_name"] || "Select"
                    : `Select batch`}{" "}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby={`dropdownMenu-${"batch"}`}
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={"Search batch"}
                    value={searchQueries["batch"] || ""}
                    onChange={(e) =>
                      handleSearchChange("batch", e.target.value)
                    }
                  />{" "}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, i) => (
                      <button
                        key={i}
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setDataToSave({
                            ...dataToSave,
                            ["batch"]: option["id"],
                          });
                        }}
                      >
                        {" "}
                        {option["batch_name"]}{" "}
                      </button>
                    ))
                  ) : (
                    <span className="dropdown-item text-muted">
                      {" "}
                      No options available{" "}
                    </span>
                  )}{" "}
                </div>
              </>
            );
          })()}
          <div className="border-0 fw-bold" id="id-1P">
            course_mode *
          </div>
          <select
            className="form-select"
            name="course_mode"
            required={true}
            value={dataToSave["course_mode"] || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, ["course_mode"]: e.target.value })
            }
          >
            <option value="">Select course_mode</option>{" "}
            {Object.keys(enums).length !== 0 &&
              enums["Course_mode"] !== undefined &&
              enums["Course_mode"]?.map((val, idx) => (
                <option key={idx} value={val}>
                  {val}
                </option>
              ))}
          </select>
          <div className="border-0 fw-bold" id="id-1V">
            user_id *
          </div>
          {(() => {
            const options = foreignKeyData["Users"] || [];
            const filteredOptions = options.filter((option) =>
              option["id"]
                ?.toLowerCase()
                .includes((searchQueries["user_id"] || "").toLowerCase())
            );
            return (
              <>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id={`dropdownMenu-${"user_id"}`}
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {" "}
                  {dataToSave["user_id"]
                    ? options.find(
                        (item) => item["id"] === dataToSave["user_id"]
                      )?.["id"] || "Select"
                    : `Select user_id`}{" "}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby={`dropdownMenu-${"user_id"}`}
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={"Search user_id"}
                    value={searchQueries["user_id"] || ""}
                    onChange={(e) =>
                      handleSearchChange("user_id", e.target.value)
                    }
                  />{" "}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, i) => (
                      <button
                        key={i}
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setDataToSave({
                            ...dataToSave,
                            ["user_id"]: option["id"],
                          });
                        }}
                      >
                        {" "}
                        {option["id"]}{" "}
                      </button>
                    ))
                  ) : (
                    <span className="dropdown-item text-muted">
                      {" "}
                      No options available{" "}
                    </span>
                  )}{" "}
                </div>
              </>
            );
          })()}
          <button className="btn btn-success" id="id-1Z" onClick={handleCreate}>
            Submit
          </button>
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

export default CreateStudent;
