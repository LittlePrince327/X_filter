import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DesktopOutlined,
  RadarChartOutlined,
  HeartOutlined,
  FireOutlined,
  UserOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import {
  FloatButton,
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Input,
  Space,
  Card,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Newboard.module.css";
import { get_user_info } from "../api";
import logo from "./logo100.png";

const { Search } = Input;
const BASE_URL = "http://localhost:8000/";
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,    
    label,
  };
}
const items = [
  getItem("All", "1", <HeartOutlined />),
  getItem("Daily", "2", <UserOutlined />),
  getItem("Politics", "3", <RadarChartOutlined />),
  getItem("Sports", "4", <FireOutlined />),
];

const Newboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleFloatButtonClick = () => {
    // 예: 새 게시물 작성 페이지로 이동
    navigate("/makeboard");
  };

  const [xfilterList, setXfilterList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchXfilterList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}board/xfilter/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setXfilterList(response.data);
    } catch (error) {
      console.error("Error fetching xfilters:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() !== "") {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}board/xfilter/?kw=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setXfilterList(response.data);
      } else {
        fetchXfilterList();
      }
    } catch (error) {
      console.error("Error fetching filtered xfilters:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString("ko-KR", options);
  };

  const fetchUserInfoAndSaveToLocalStorage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await get_user_info(token);

        const fullName = userData.full_name;

        if (fullName) {
          localStorage.setItem("author", fullName);
        }
      } else {
        console.error("토큰이 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 데 문제가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchXfilterList();
    fetchUserInfoAndSaveToLocalStorage();
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <FloatButton
        style={{
          marginRight: 40,
          width: 60,
          height: 60,
        }}
        type="primary"
        onClick={handleFloatButtonClick}
        tooltip={<div>새 게시물 작성</div>}
      />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200} // 펼쳐졌을 때의 너비
        collapsedWidth={80} // 접혔을 때의 너비
        style={{
          height: "100vh",
          position: "fixed",
        }}
      >
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
        <Menu
          className={styles.menu}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, height: "100vh" }}>
        <Header
          style={{
            backgroundColor:'#ffff',
            // zIndex: 1,
            width: "100%",
            top: 0,
          }}
        >
          <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="제목,작성자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.bord_btn} onClick={handleSearch}>
              Search
            </button>
          </div>
        </Header>
        <Content
          style={{
            // marginBottom: 10, // Header 아래에 위치하도록 marginTop 조정
            overflow: "auto",
            height: "calc(100vh - 64px)", // 전체 높이에서 Header 높이만큼 제외
            paddingTop: 20, // 내용과 Header 사이의 간격
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          ></Breadcrumb>
          {xfilterList.map((xfilter) => (
            <Card
            onClick={() => navigate(`/detail/${xfilter.id}`)}
            title={xfilter.author}
            className={styles.cardHoverEffect} // Add this line
            style={{
              // boxShadow: '1px 2px 9px #BDBDBD',
              marginLeft: '30%',
              marginTop: 20,
              width: 700,
              height: 400,
            }}
            >
              {xfilter.content.length > 20
                ? `${xfilter.content.substring(0, 40)}...`
                : xfilter.content}
            </Card>
          ))}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Newboard;
