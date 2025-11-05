import StudentEdit from "./components/Edit/StudentEdit";
import BatchEdit from "./components/Edit/BatchEdit";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Approve_Reject_Certificate from "./components/Approve_Reject_Certificate";
import Batch_Config from "./components/Batch_Config";
import Records from "./components/Records";
import Upload from "./components/Upload";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Edit from './components/Edit/Edit';



function App() {
  return (
    <Routes>
      
      <Route path='/edit' element={<Edit/>}/>
      <Route path='/upload' element={<Upload />} />
  <Route path='/records' element={<Records />} />
  <Route path='/batch_config' element={<Batch_Config />} />
  <Route path='/approve_reject_certificate' element={<Approve_Reject_Certificate />} />
  <Route path='/registration' element={<Registration />}/>
  <Route path='/login' element={<Login />}/>
  <Route path='/edit/batch/:id' element={<BatchEdit />} />
    <Route path='/edit/student/:id' element={<StudentEdit />} />
  </Routes>
  );
}

export default App;
