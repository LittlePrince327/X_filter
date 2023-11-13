import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './Join/Join';
import Signup from './Signup/Signup';
import FindUsername from './FindUsername/FindUsername';
import ResetPassword from './ResetPassword/ResetPassword';
import Board from './Board/Board'; 
import MakeBoard from './MakeBoard/MakeBoard'; 
import DetailBoard from './DetailBoard/DetailBoard';
import Main from './Main/Main';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/board" element={<Board />} />
        <Route path="/makeboard" element={<MakeBoard />} />
        <Route path="/detail/:id" element={<DetailBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
