import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Join.css';

function Join() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      const requestData = {
        username: username,
        password: password,
      };

      Axios.post('http://localhost:8000/api/user-login/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('username', username); 
            navigate('/chat');
          } else {
            return Promise.reject(response.data);
          }
        })
        .catch((error) => {
          setLoginError('아이디와 비밀번호를 확인해주세요.');
        });
    } else {
      setLoginError('아이디와 비밀번호를 입력해주세요.');
    }
  };

  const handleFindUsername = () => {
    navigate('/findusername');
  };

  const handleForgotPassword = () => {
    navigate('/resetpassword');
  };

  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>X_FILTER</h1>
        <div>
          <input
            placeholder='Name'
            className='joinInput'
            type='text'
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder='Password'
            className='joinInput mt-20'
            type='password'
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {loginError && <p className='error-message'>{loginError}</p>}
        <button className='button mt-20' onClick={handleLogin}>
          로그인
        </button>
        <Link to="/findusername">
          <button onClick={handleFindUsername} className='button mt-20'>
            아이디 찾기
          </button>
        </Link>
        <Link to="/resetpassword">
          <button onClick={handleForgotPassword} className='button mt-20'>
            비밀번호 재설정
          </button>
        </Link>
        <Link to="/signup">
          <button className='button mt-20' type='submit'>
            회원가입
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Join;