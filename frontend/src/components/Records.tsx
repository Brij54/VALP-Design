import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Records.css";

import ReadStudent from "./Resource/ReadStudent";

export default function Records() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-21"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <ReadStudent />
      </div>
    </>
  );
}
