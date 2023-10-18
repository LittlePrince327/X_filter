import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios'; // Import Axios

import './Join.css';

function Join() {
  const [Name, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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
          window.location.href = `/chat?name=${data.username}&room=${room}`;
        })
        .catch((error) => {
          setLoginError('아이디와 비밀번호를 확인해주세요.'); // Set the error message
        });
    } else {
      setLoginError('Please provide a user ID and password.');
    }
  }

  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>X_FILTER</h1>
        <div>
          <input
            placeholder='User ID'
            className='joinInput'
            type='text'
            onChange={(event) => setUserId(event.target.value)}
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
        {loginError && <p className='error-message'>{loginError}</p>} {/* Display the error message */}
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

// Function to generate a random room address
function generateRandomRoomAddress() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8; // Adjust the desired length of the room address
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export default Join;
