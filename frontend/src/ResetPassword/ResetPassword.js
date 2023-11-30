import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import styles from './ResetPassword.module.css';
import logo from './logo100.png';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordResetFields, setShowPasswordResetFields] = useState(false); 

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
          setShowPasswordResetFields(true);
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
    window.location.href = 'http://localhost:8000/idpassword/password_reset/';
  };

  return (
    <div className={styles.outerContainer}>
    <header className={styles.header}>
      <Link to="/">
        <img src={logo} alt="Logo" className="main_header_logo" />
        </Link>
      </header>
    <div className={styles.container}>
      <h1 className={`heading ${styles.heading}`}>XNS 비밀번호 재설정</h1>
      <form className={styles.form}>
      <div>
      <div>
        <input
         className={`joinInput mt-20 ${styles.input}`}
          placeholder='아이디'
          type='text'
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <input
         className={`joinInput mt-20 ${styles.input}`}
          placeholder='이메일'
          type='email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleResetPassword}>회원정보 조회하기</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {showPasswordResetFields && (
        <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleGoToPasswordReset}>비밀번호 재설정 페이지로 이동</button>
      )}
    </div>
      </form>
    </div>
    <footer className={styles.footer}>
      <p>ⓒ XNS Company. All Rights Reserved.</p>
    </footer>
  </div>
  );
}

export default ResetPassword;
