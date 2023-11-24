import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import styles from './FindUsername.module.css';
import logo from './logo100.png';

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
    <div className={styles.outerContainer}>
      <header className={styles.header}>
        <Link to="/">
          <img src={logo} alt="Logo" className="main_header_logo" />
          </Link>
        </header>
      <div className={styles.container}>
        <h1 className={`heading ${styles.heading}`}>XNS 아이디 찾기</h1>
        <form className={styles.form}>
        <div>
      <div>
        <input
         className={`joinInput mt-20 ${styles.input}`}
          placeholder='이메일'
          type='email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleSearchUsername}>아이디 찾기</button>
      </div>
      <br/>
      {username && <p className={styles.usernameParagraph}>사용자 아이디: {username}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
        </form>
      </div>
      <footer className={styles.footer}>
        <p>저작권 © 2023 회사명. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}

export default FindUsername;