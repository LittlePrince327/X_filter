import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.css';

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
  
    const formDataToSend = new FormData();
  
    // Append other form data
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('full_name', formData.full_name);
  
    // Append profile picture
    formDataToSend.append('profile_picture', formData.profile_picture);
  
    try {
      const response = await axios.post('http://localhost:8000/api/user-signup/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('API response:', response);
  
      if (response.status === 201) {
        console.log('Sign up successful!', response.data);
        navigate('/');
      } else {
        console.error('Sign up failed:', response.data);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_picture: file,
    });
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
          <div>
            <input
              className={`joinInput mt-20 ${styles.input}`}
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          {usernameError && <p className={styles.errorMessage}>이메일 형식의 닉네임은 사용할 수 없습니다.</p>}
          {passwordMismatch && <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}
          {emailError && <p className={styles.errorMessage}>유효하지 않은 이메일 형식입니다.</p>}
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={handleSignup}>
            회원가입
          </button>
          <button className={`joinInput mt-20 ${styles.button}`} type="button" onClick={() => navigate('/')}>
            홈
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
