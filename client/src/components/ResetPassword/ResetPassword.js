import React, { useState } from 'react';
import Axios from 'axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchUsername = () => {
    if (email) {
      // 클라이언트에서 서버로 이메일을 보내서 아이디를 조회
      Axios.post('http://localhost:8000/api/get-username/', { email: email })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          setErrorMessage('사용자 정보를 찾을 수 없습니다.');
        });
    } else {
      setErrorMessage('이메일을 입력해주세요.');
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
      <h2>비밀번호 재설정</h2>
      <div>
      <input
            placeholder='아이디'
            type='text'
            onChange={(event) => setUsername(event.target.value)}
        />
        <br/>
        <input
          placeholder='이메일'
          type='email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={handleSearchUsername}>비밀번호 재설정</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default ResetPassword;
