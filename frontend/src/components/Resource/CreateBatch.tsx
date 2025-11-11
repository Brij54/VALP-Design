import React, { useState, useEffect, useRef } from 'react';
    import apiConfig from '../../config/apiConfig';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchForeignResource } from '../../apis/resources';
import { fetchEnum } from '../../apis/enum';


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

const CreateBatch = () => {
const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
     const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
   const apiUrl = apiConfig.getResourceUrl("Batch");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Batch")
  
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
const { data: metaData, isLoading, error } = useQuery({
  queryKey: ['resMetaData'],
  queryFn: async () => {
    const res = await fetch(metadataUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata: ${res.statusText}`);
    }

    const data = await res.json();

    setResMetaData(data);
    setFields(data[0].fieldValues);

    const foreignFields = data[0].fieldValues.filter((field: any) => field.foreign);
    for (const field of foreignFields) {
      if (!fetchedResources.current.has(field.foreign)) {
        fetchedResources.current.add(field.foreign);

        queryClient.prefetchQuery({
          queryKey: ['foreignData', field.foreign],
          queryFn: () => fetchForeignResource(field.foreign),
        });

        await fetchForeignData(field.foreign, field.name, field.foreign_field);
      }
    }

    const enumFields = data[0].fieldValues.filter((field: any) => field.isEnum === true);
    for (const field of enumFields) {
      if (!fetchedEnum.current.has(field.possible_value)) {
        fetchedEnum.current.add(field.possible_value);

        queryClient.prefetchQuery({
          queryKey: ['enum', field.possible_value],
          queryFn: () => fetchEnum(field.possible_value),
        });

        await fetchEnumData(field.possible_value);
      }
    }

    return data;
  },
});


  useEffect(()=>{
    console.log("data to save",dataToSave)
  },[dataToSave])
 

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
   const accessToken = getCookie("access_token");

  if (!accessToken) {
    throw new Error("Access token not found");
  }

    
    const response = await fetch(apiUrl+`?`+params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`, // Add token here
        
      },
      credentials: 'include', // include cookies if needed
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
    {/* <div id="id-4D" className="d-flex flex-column border border-2 p-2 gap-2 mb-2"> */}
      {/* <div className="border-0 fw-bold fs-3" id="id-4F">Batch</div> */}
    <div className="border-0 fw-bold" id="id-4J">batch_name *</div>
    <input type="text" className="form-control mb-4" name="batch_name" required={true} value={dataToSave["batch_name"] || ""} onChange={(e) => setDataToSave({ ...dataToSave, ["batch_name"]: e.target.value }) }
/><div className="border-0 fw-bold" id="id-4P">no_of_courses *</div><input type="text" className="form-control mb-4" name="no_of_courses" required={true} value={dataToSave["no_of_courses"] || ""} onChange={(e) => setDataToSave({ ...dataToSave, ["no_of_courses"]: e.target.value }) }
/><button className="btn btn-success" id="id-4T" onClick={handleCreate}>Add Batch</button>
{/* </div> */}
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
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body text-success text-center">Created successfully!</div>
        </div>
      </div>
    )}
  </div>
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
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
        <div className="toast-body text-success text-center">Created successfully!</div>
      </div>
    </div>
) }

</div>
)


};

export default CreateBatch