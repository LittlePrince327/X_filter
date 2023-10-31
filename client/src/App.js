import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";
import Signup from "./components/Signup/Signup";
<<<<<<< HEAD
import UserProfileEdit from "./components/profileedit/UserProfileEdit";
=======
import FindUsername from "./components/FindUsername/FindUsername";
import ResetPassword from "./components/ResetPassword/ResetPassword";
>>>>>>> f61da2d88ae55c8458862d79c482228c53e886d1

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Join />} />
<<<<<<< HEAD
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/edit/:userId" component={UserProfileEdit} />
        
=======
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
>>>>>>> f61da2d88ae55c8458862d79c482228c53e886d1
      </Routes>
    </Router>
  );
}
export default App;
