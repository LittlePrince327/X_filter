import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";
import Signup from "./components/Signup/Signup";
import UserProfileEdit from "./components/profileedit/UserProfileEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Join />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/edit/:userId" component={UserProfileEdit} />
        
      </Routes>
    </Router>
  );
}
export default App;
