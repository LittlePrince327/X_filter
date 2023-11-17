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
  getItem("Technology", "5", <DesktopOutlined />),
  getItem("Entertainment", "6", <DesktopOutlined />),
  getItem("Science and Nature", "7", <DesktopOutlined />),
  getItem("Gaming", "8", <DesktopOutlined />),
  getItem("Books and Literature", "9", <DesktopOutlined />),
  getItem("Health and Fitness", "10", <DesktopOutlined />),
  getItem("Travel", "11", <DesktopOutlined />),
  getItem("Food and Cooking", "12", <DesktopOutlined />),
  getItem("Art and Creativity", "13", <DesktopOutlined />),
  getItem("Technology Help/Support", "14", <DesktopOutlined />),
];

const Newboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleFloatButtonClick = () => {
    // 예: 새 게시물 작성 페이지로 이동
    navigate("/makeboard");
  };

  const [xfilterList, setXfilterList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const handleCategoryChange = async (category) => {
    try {
      const token = localStorage.getItem("token");
      let response;

      if (category === "All") {
        response = await axios.get(`${BASE_URL}board/xfilter/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.get(
          `${BASE_URL}board/xfilter/?category=${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setXfilterList(response.data);
      setSelectedCategory(category);
    } catch (error) {
      console.error(`${category} 카테고리 xfilters를 가져오는 중 오류 발생:`, error);
    }
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
        width={200}
        collapsedWidth={80}
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
          selectedKeys={[selectedCategory]}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleCategoryChange(item.label)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, height: "100vh" }}>
        <Header
          style={{
            backgroundColor: "#ffff",
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
            overflow: "auto",
            height: "calc(100vh - 64px)",
            paddingTop: 20,
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          ></Breadcrumb>
          {xfilterList.map((xfilter) => (
            <Card
              key={xfilter.id}
              onClick={() => navigate(`/detail/${xfilter.id}`)}
              title={xfilter.author}
              className={styles.cardHoverEffect}
              style={{
                marginLeft: "30%",
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
