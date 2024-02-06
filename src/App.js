//  App.js file

import React from "react";
import { BrowserRouter as Router, Route ,Routes} from "react-router-dom";
import Form from "./Components/Form/Form";
import Details from "./Components/Details/Details";
import LoginForm from "./Components/login/login";
import EditModal from "./Components/Edit/Edit";
import UsersList from "./Components/List/list";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<Form />} />
        <Route path="/details" element={<Details />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/edit" element={<EditModal />} />
        <Route path="/list" element={<UsersList/>} />
      </Routes>
      </div>
    </Router>
    
  );
};

export default App;
