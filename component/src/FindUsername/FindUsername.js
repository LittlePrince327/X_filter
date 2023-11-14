import React, { useState } from 'react';
import Axios from 'axios';
import './FindUsername.css';

function FindUsername() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchUsername = () => {
    if (email) {
      Axios.post('http://localhost:8000/idpassword/findusername', { email })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          setErrorMessage('사용자 정보를 찾을 수 없습니다.');
          setUsername('');
        });
    } else {
      setErrorMessage('이메일을 입력해주세요.');
      setUsername('');
    }
  };

  return (
    <div>
      <h2>아이디 찾기</h2>
      <div>
        <input
          placeholder='이메일'
          type='email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={handleSearchUsername}>아이디 찾기</button>
      </div>
      {username && <p>사용자 아이디: {username}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default FindUsername;