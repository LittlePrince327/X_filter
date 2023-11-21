import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './Join/Join';
import Signup from './Signup/Signup';
import FindUsername from './FindUsername/FindUsername';
import ResetPassword from './ResetPassword/ResetPassword';
import MakeBoard from './MakeBoard/MakeBoard'; 
import Main from './Main/Main';
import Newboard from './Board/Newboard';
import DetailBoard from './DetailBoard/DetailBoard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/detaliboard" element={<DetailBoard />}/>
        <Route path="/newboard" element={<Newboard />}/>
        <Route path="/join" element={<Join />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/makeboard" element={<MakeBoard />} />
        <Route path="/detail/:id" element={<DetailBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
