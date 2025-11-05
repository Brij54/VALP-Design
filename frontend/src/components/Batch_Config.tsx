import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Batch_Config.css";

import CreateBatch from "./Resource/CreateBatch";

import UpdateBatch from "./Resource/UpdateBatch";

export default function Batch_Config() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-4D"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateBatch />
      </div>
      <div
        id="id-4V"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <UpdateBatch />
      </div>
    </>
  );
}
