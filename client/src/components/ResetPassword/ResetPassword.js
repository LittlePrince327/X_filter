import React, { useState } from 'react';
import Axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // 비밀번호 입력 필드 표시 여부 상태 추가

  const handleResetPassword = () => {
    if (email && username) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('올바른 이메일 주소를 입력해주세요.');
        return;
      }

      Axios.post('http://localhost:8000/idpassword/resetpassword', {
        email: email,
        username: username,
      })
        .then((response) => {
          setShowPasswordFields(true);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('비밀번호 재설정 실패:', error);
          setErrorMessage('비밀번호 재설정에 실패했습니다.');
        });
    } else {
      setErrorMessage('아이디, 이메일을 입력해주세요.');
    }
  };

  const handleGoToPasswordReset = () => {
    // 사용자 정보 조회에 성공한 후 비밀번호 재설정 페이지로 이동
    window.location.href = 'http://localhost:8000/idpassword/password_reset/';
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
        <button onClick={handleResetPassword}>사용자 정보 조회하기</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {showPasswordFields && (
        <button onClick={handleGoToPasswordReset}>비밀번호 재설정 페이지로 이동</button>
      )}
    </div>
  );
}

export default ResetPassword;
