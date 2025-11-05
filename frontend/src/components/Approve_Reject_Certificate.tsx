

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Approve_Reject_Certificate.css";

          
            import UpdateStudent from './Resource/UpdateStudent';

            export default function Approve_Reject_Certificate() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-5D" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><UpdateStudent/></div>

              </>

            );

          }