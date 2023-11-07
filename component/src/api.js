import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', 
});

const BASE_URL = 'http://localhost:8000/'

const signup = (userData) => {
  return API.post('/api/user-signup/', userData);
};

const login = (credentials) => {
  return API.post('/api/user-login/', credentials);
};

const findUsername = (email) => {
  return API.post('/idpassword/findusername', { email });
};

const resetPassword = (userData) => {
  return API.post('/idpassword/resetpassword/', userData);
};

const search = (data) => {
  return API.get('/board/xfilter/', { params: data });
};

const detail = (xfilterId) => {
  return API.get(`/board/xfilter/${xfilterId}/`);
};

const get_user_info = (full_name) => {
  return API.post('/api/get-user-info', {full_name});
};

async function postBoard(content, author, create_date, userToken) {
  const body = {
    content: content,
    author: author,
    create_date : create_date
  };
  const headerOption = {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  };

  const response = await axios.post(`${BASE_URL}/board/xfilter/create`, body, headerOption);
  const data = await response.data;
  return data;
};

const createComment = (content, postId) => {
  return API.post(`/board/comment/create/${postId}/`, { content });
};

const editPost = (postId) => {
  return API.post(`/board/xfilter/modify/${postId}/`);
};

const editComment = (commentId) => {
  return API.post(`/board/comment/modify/${commentId}/`);
};

const deletePost = (postId) => {
  return API.delete(`/board/xfilter/delete/${postId}/`);
};

const deleteComment = (commentId) => {
  return API.delete(`/board/comment/delete/${commentId}/`);
};

const recommendPost = (postId) => {
  return API.post(`/board/xfilter/vote/${postId}/`);
};

const recommendComment = (commentId) => {
  return API.post(`/board/comment/vote/${commentId}/`);
};

export { 
  signup, 
  login, 
  findUsername, 
  resetPassword, 
  search, 
  detail, 
  get_user_info,
  postBoard, 
  createComment, 
  editPost, 
  editComment, 
  deletePost, 
  deleteComment, 
  recommendPost, 
  recommendComment 
};
