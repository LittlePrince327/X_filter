import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 추가
  const [showPasswordFields, setShowPasswordFields] = useState(false); // 비밀번호 입력 필드 표시 상태




  const handleResetPassword = () => {
    if (email && username) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('올바른 이메일 주소를 입력해주세요.');
        return;
      }

      Axios.post('http://localhost:8000/idpassword/resetpassword', {
        email : email,
        username : username,
      }, 
      ).then((response) => {
          setShowPasswordFields(true); // 유효성 검사 성공 시 비밀번호 입력 필드 표시
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

  // 이전 코드에서 handlePasswordReset 함수
  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 새로운 비밀번호를 백엔드로 전송
    Axios.post('http://localhost:8000/idpassword/resetpassword', {
      username,
      email,
      new_password: newPassword,
      confirm_password: confirmPassword
    })
      .then((response) => {
        console.log('비밀번호 업데이트 성공:', response);
        setErrorMessage('비밀번호가 성공적으로 변경되었습니다.');
        setShowPasswordFields(false);
      })
      .catch((error) => {
        console.error('비밀번호 업데이트 실패:', error);
        setErrorMessage('비밀번호 변경에 실패했습니다.');
      });
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
      {showPasswordFields && (
        <div>
          <input
            placeholder='새로운 비밀번호'
            type='password'
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <input
            placeholder='비밀번호 확인'
            type='password'
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button onClick={handlePasswordReset}>비밀번호 재설정</button>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default ResetPassword;