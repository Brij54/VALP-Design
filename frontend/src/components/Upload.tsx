

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Upload.css";

          
            import CreateStudent from './Resource/CreateStudent';

            export default function Upload() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-1" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><CreateStudent/></div>

              </>

            );

          }