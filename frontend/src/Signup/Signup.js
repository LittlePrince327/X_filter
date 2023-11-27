import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from './Signup.module.css';
import logo from './logo100.png';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',                           
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [signupError, setSignupError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }

    if (name === 'username') {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (emailPattern.test(value)) {
        setUsernameError(true);
      } else {
        setUsernameError(false);
      }
    }

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
  
    if (emailError || usernameError) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/user-signup/', formData);
      console.log('API response:', response);
  
      if (response.status === 201) {
        console.log('Sign up successful!', response.data);
        navigate('/');
      } else {
        console.error('Sign up failed:', response.data);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
  
      if (error.response && error.response.data && error.response.data.error === 'User with this full_name already exists.') {
        setSignupError('이미 사용 중인 이름입니다.');
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };
  

  useEffect(() => {
    if (passwordMismatch) {
      const timeout = setTimeout(() => {
        setPasswordMismatch(false);
      }, 100000);
      return () => clearTimeout(timeout);
    }
  }, [passwordMismatch]);

  return (
    <div className={styles.outerContainer}>
      <header className={styles.header}>
        <Link to="/">
          <img src={logo} alt="Logo" className="main_header_logo" />
          </Link>
        </header>
      <div className={styles.container}>
        <h1 className={`heading ${styles.heading}`}>XNS 회원가입</h1>
        <form className={styles.form}>
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="User ID"
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
          <div>                    
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="text"
              name="full_name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>
          {usernameError && <p className={styles.errorMessage}>이메일 형식의 닉네임은 사용할 수 없습니다.</p>}
          {passwordMismatch && <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}
          {emailError && <p className={styles.errorMessage}>유효하지 않은 이메일 형식입니다.</p>}
          {signupError && <p className={styles.errorMessage}>이미 사용중인 이름입니다.</p>}
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleSignup}>
            회원가입
          </button>
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={() => navigate('/')}>
            홈
          </button>
        </form>
      </div>
      <footer className={styles.footer}>
        <p>ⓒ XNS Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;
