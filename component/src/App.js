import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from "./Join/Join";
import Signup from "./Signup/Signup";
import FindUsername from "./FindUsername/FindUsername";
import ResetPassword from "./ResetPassword/ResetPassword";
import Main from "./Main/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/main" element={<Main />} />

      </Routes>
    </Router>
  );
}

export default App;
