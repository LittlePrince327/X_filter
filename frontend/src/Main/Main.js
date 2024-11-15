import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Main.css"; 
import { Card } from "antd";
import logo from './logo100.png';


const Main = () => {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      const requestData = {
        username: username,
        password: password,
      };
      Axios.post("http://localhost:8000/api/user-login/", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.data.access);
          if (response.status === 200) {
            localStorage.setItem("token", response.data.access);
            navigate("/board");
          } else {
            return Promise.reject(response.data);
          }
        })
        .catch((error) => {
          setLoginError("아이디와 비밀번호를 확인해주세요.");
        });
    } else {
      setLoginError("아이디와 비밀번호를 입력해주세요.");
    }
  };

  return (
    <div className="maincontainer">
        <header className="main_header">
          <Link to ="/">
          <img src={logo} alt="Logo" className="main_header_logo" />
          </Link>
        </header>
      <div className="main_text">
        <p>비속어로 지친 당신을 위해</p>
        <tr />
        <p> 비속어 없는 소셜네트워크서비스 </p>
        <tr />
      </div>
      <Card
       className="main_card"
        title="지금 로그인 및 회원가입 하기"
        bordered={false}
        style={{
          width: 400,
          height: 500,
        }}
      >
        <div>
          <input
            placeholder="Name"
            className="main_input"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            className="main_input mt-20"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {loginError && <p className="error-message">{loginError}</p>}
        <button className="button mt-20" onClick={handleLogin}>
          로그인
        </button>
        <Link to="/signup">
          <button className="button mt-20" type="submit">
            회원가입
          </button>
        </Link>
       <div className="main_links">
        <Link to="/findusername">
          아이디찾기 
        </Link>
        <a> / </a>
        <Link to="/resetpassword">
          비밀번호재설정
        </Link>
        </div>
      </Card>
      <footer className="main_footer">
        <p>ⓒ XNS Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Main;
