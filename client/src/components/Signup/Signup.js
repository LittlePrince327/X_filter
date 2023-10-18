import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      // API 요청 보내기
      const response = await axios.post('http://localhost:8000/api/user-signup/', formData);

      console.log('API 응답:', response);

      if (response.status === 201) {
        console.log('회원가입 성공!', response.data);
        navigate('/'); // 회원가입 성공 시 리디렉션
      } else {
        console.error('회원가입 실패:', response.data);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  useEffect(() => {
    if (passwordMismatch) {
      const timeout = setTimeout(() => {
        setPasswordMismatch(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [passwordMismatch]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h1 className={`heading ${styles.heading}`}>X_FILTER</h1>
        <form className={styles.form}>
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
          </div>
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          {passwordMismatch && <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleSignup}>
            회원가입
          </button>
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={() => navigate('/')}>
            홈으로
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
