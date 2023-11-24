import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './Main/Main';
import Board from './Board/Board';
import Signup from './Signup/Signup';
import MakeBoard from './MakeBoard/MakeBoard';
import DetailBoard from './DetailBoard/DetailBoard';
import FindUsername from './FindUsername/FindUsername';
import ResetPassword from './ResetPassword/ResetPassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Board" element={<Board />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/makeboard" element={<MakeBoard />} />
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/detaliboard" element={<DetailBoard />} />
        <Route path="/detail/:id" element={<DetailBoard />} />
      </Routes>
    </Router>

  );
}

export default App;
