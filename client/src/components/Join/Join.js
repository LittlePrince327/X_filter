import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import Axios from 'axios';
import './Join.css';

function Join() {
  const [Name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // useNavigate 추가

  const handleLogin = () => {
    if (Name && password) {
      const requestData = {
        username: Name,
        password: password,
      };

      Axios.post('http://localhost:8000/api/user-login/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const room = generateRandomRoomAddress();
            return { data: response.data, room };
          } else {
            return Promise.reject(response.data);
          }
        })
        .then((result) => {
          const { data, room } = result;
          // '/chat'로 이동하면서 정보를 'state' 객체에 전달합니다.
          navigate('/chat', { state: { name: data.username, room: room } }); // navigate 사용
        })
        .catch((error) => {
          setLoginError('아이디와 비밀번호를 확인해주세요.');
        });
    } else {
      setLoginError('아이디와 비밀번호를 제공해주세요.');
    }
  }

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
        <Link to="/signup">
          <button className='button mt-20' type='submit'>
            회원가입
          </button>
        </Link>
      </div>
    </div>
  );
}

function generateRandomRoomAddress() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export default Join;
