// ResetPassword.js
import React, { useState } from 'react';
import Axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = () => {
    if (email && username) {
      Axios.post('http://localhost:8000/idpassword/resetpassword/', { email, username })
        .then((response) => {
          // 비밀번호 재설정 성공 메시지나 추가적인 작업을 수행할 수 있습니다.
        })
        .catch((error) => {
          setErrorMessage('비밀번호 재설정에 실패했습니다.');
        });
    } else {
      setErrorMessage('아이디와 이메일을 입력해주세요.');
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      <div>
        <input
          placeholder='아이디'
          type='text'
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <input
          placeholder='이메일'
          type='email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={handleResetPassword}>비밀번호 재설정</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default ResetPassword;