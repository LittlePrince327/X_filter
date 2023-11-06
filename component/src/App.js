import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './Join/Join';
import Signup from './Signup/Signup';
import FindUsername from './FindUsername/FindUsername';
import ResetPassword from './ResetPassword/ResetPassword';
import Main from './Main/Main';
import Search from './Search/Search';
import Detail from './Detail/Detail';
import Comment from './Comment/Comment';
import BoardComponent from './BoardComponent/BoardComponent';
import PostModal from './PostModal/PostModal';
import PostTable from './PostTable/PostTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findusername" element={<FindUsername />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/main" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/boardcomponent" element={<BoardComponent />} /> {/* Corrected route path */}
        <Route path="/postmodal" element={<PostModal />} />
        <Route path="/posttable" element={<PostTable />} />
      </Routes>
    </Router>
  );
}

export default App;
