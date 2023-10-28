import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";
import Signup from "./components/Signup/Signup";
import FindUsername from "./components/FindUsername/FindUsername";
import ResetPassword from "./components/ResetPassword/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Join />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
