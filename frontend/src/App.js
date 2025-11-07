// import StudentEdit from "./components/Edit/StudentEdit";
// import BatchEdit from "./components/Edit/BatchEdit";
// import Login from "./components/Login/Login";
// import Registration from "./components/Registration/Registration";
// import Approve_Reject_Certificate from "./components/Approve_Reject_Certificate";
// import Batch_Config from "./components/Batch_Config";
// import Records from "./components/Records";
// import Upload from "./components/Upload";
// import './App.css';
// import { Route, Routes } from 'react-router-dom';
// import Edit from './components/Edit/Edit';
// import ProtectedRoute from "./components/ProtectedRoute";



// function App() {
//   return (
//     <Routes>
//       <Route path='/login' element={<Login />}/>
//       <Route path='/registration' element={<Registration />}/>
      
//       <Route path='/edit' element={<Edit/>}/>
//       <Route path='/upload' element={
//         <ProtectedRoute><Upload /></ProtectedRoute>
//       } />
//       <Route path='/records' element={
//         <ProtectedRoute><Records /></ProtectedRoute>
//         } />
//       <Route path='/batch_config' element={
//         <ProtectedRoute><Batch_Config /></ProtectedRoute>
//       } />
//       <Route path='/approve_reject_certificate' element={
//         <ProtectedRoute><Approve_Reject_Certificate /></ProtectedRoute>
//       } />
//       <Route path='/edit/batch/:id' element={
//         <ProtectedRoute><BatchEdit /> </ProtectedRoute>
//       } />
//       <Route path='/edit/student/:id' element={
//         <ProtectedRoute><StudentEdit /> </ProtectedRoute>
//       } />
//   </Routes>
//   );
// }

// export default App;

// src/App.tsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Edit from "./components/Edit/Edit";
import Upload from "./components/Upload";
import Records from "./components/Records";
import Batch_Config from "./components/Batch_Config";
import Approve_Reject_Certificate from "./components/Approve_Reject_Certificate";
import StudentEdit from "./components/Edit/StudentEdit";
import BatchEdit from "./components/Edit/BatchEdit";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/edit" element={<Edit />} />

      {/* STUDENT ROUTES */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute requiredRoles={["student"]}>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute requiredRoles={["student"]}>
            <Records />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/batch_config"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <Batch_Config />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approve_reject_certificate"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <Approve_Reject_Certificate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/batch/:id"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <BatchEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/student/:id"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <StudentEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
