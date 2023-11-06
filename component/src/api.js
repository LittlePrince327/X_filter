import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', 
});

// 회원가입 요청 API
const signup = (userData) => {
  return API.post('/api/user-signup/', userData);
};

// 로그인 요청 API
const login = (credentials) => {
  return API.post('/api/user-login/', credentials);
};

// 아이디 찾기 요청 API
const findUsername = (email) => {
  return API.post('/idpassword/findusername', { email });
};

// 비밀번호 재설정을 위한 요청 API
const resetPassword = (userData) => {
  return API.post('/idpassword/resetpassword/', userData);
};

// 검색 기능을 위한 요청 API
const search = (Data) => {
  return API.post('/board/xfilter/', Data);
};

// 상세 페이지 기능을 위한 요청 API
const detail = (Data) => {
  return API.post('/board/xfilter/<int:xfilter_id>/', Data);
};

// 댓글 저장 요청 API
const commentsave = (Data) => {
  return API.post('/board/comment/create/<int:xfilter_id>/', Data);
};

// 댓글 수정 요청 API
const commentmodify = (Data) => {
  return API.post('/board/comment/modify/<int:comment_id>/', Data);
};

// 댓글 삭제 요청 API
const commentdelete = (Data) => {
  return API.post('/board/comment/delete/<int:comment_id>/', Data);
};

// 댓글 추천 요청 API
const commentvote = (Data) => {
  return API.post('/board/comment/vote/<int:comment_id>/', Data);
};

// 댓글 추천 요청 API
const xfiltersave = (Data) => {
  return API.post('/board/xfilter/create/', Data);
};

// 댓글 추천 요청 API
const xfiltermodify = (Data) => {
  return API.post('/board/xfilter/modify/<int:xfilter_id>/', Data);
};

// 댓글 추천 요청 API
const xfilterdelete = (Data) => {
  return API.post('/board/xfilter/delete/<int:xfilter_id>/', Data);
};

// 댓글 추천 요청 API
const xfiltervote = (Data) => {
  return API.post('/board/xfilter/vote/<int:xfilter_id>/', Data);
};


export { 
  signup, login, findUsername, resetPassword, search, detail, commentsave, commentmodify, commentdelete, commentvote,
  xfiltersave, xfiltermodify, xfilterdelete, xfiltervote 
};