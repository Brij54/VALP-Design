import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Edit = () => {
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Batch");
  const apiUrl = `${apiConfig.getResourceUrl("Batch")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token here
      },
      credentials: "include", // include cookies if needed
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
    "Batch"
  );

  useEffect(() => {
    // console.log()

    if (fetchDataById.length > 0 && !loadingEditComp) {
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(fetchedDataById["resource"][0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
      console.log(
        "fetched data by ID",
        fetchedDataById,
        loadingEditComp,
        editedRecord
      );
    }
  }, [fetchedDataById, loadingEditComp]);

  useEffect(()=>{
    console.log("my edited record", editedRecord)
  },[editedRecord])
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

  const handleEdit = ( field: string, value: string) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };
  const base64EncodeFun = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (editedRecord.length === 0) return;

    const jsonString = JSON.stringify(editedRecord);

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
          Authorization: `Bearer ${accessToken}`, // Add token here
        },
        credentials: "include", // include cookies if needed
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

  return (
    <>
      {!loadingEditComp && (
        <div className="container mt-4">
          <form>
            <div
              id="id-4D"
              className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
            >
              <div className="border-0 fw-bold fs-3" id="id-4F">
                Batch
              </div>
              <div id="id-4H" className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold" id="id-4J">
                  batch_name *
                </div>
                <input
                  className="form-control"
                  placeholder="batch_name"
                  id="id-4X"
                  name="batch_name"
                  value={editedRecord.batch_name}
                  onChange={(e)=> {
                    handleEdit(e.target.name, e.target.value)
                  }}
                  />
              </div>
              <div id="id-4N" className="border-0 w-100 bg-light">
                <div className="border-0 fw-bold" id="id-4P">
                  no_of_courses *
                </div>
                <input
                  className="form-control"
                  placeholder="no_of_courses"
                  id="id-53"
                  name="no_of_courses"
                  value={editedRecord.no_of_courses}
                  onChange={(e)=> {
                    handleEdit(e.target.name, e.target.value)
                  }}
                />
              </div>
              <button
                className="btn btn-success"
                id="id-4T"
                onClick={(e) => handleUpdate(id, e)}
              >
                Submit
              </button>
            </div>
          </form>

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
