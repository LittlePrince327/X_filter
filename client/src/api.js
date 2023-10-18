// client/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Django 백엔드의 주소로 변경해야 합니다.
});

// 회원가입 요청
const signup = (userData) => {
  return API.post('/api/user-signup/', userData);
};

// 로그인 요청
const login = (credentials) => {
  return API.post('/api/user-login/', credentials);
};

// 다른 API 요청을 추가할 수 있습니다.

export { signup, login };
