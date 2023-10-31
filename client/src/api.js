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

export { signup, login, findUsername, resetPassword };
