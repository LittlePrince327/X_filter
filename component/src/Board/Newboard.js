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
  Row,
  Col,
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

<<<<<<< HEAD
=======
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

>>>>>>> main
const Newboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleFloatButtonClick = () => {
    navigate("/makeboard");
  };

  const [xfilterList, setXfilterList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followStatus, setFollowStatus] = useState({});
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      console.error(
        `${category} 카테고리 xfilters를 가져오는 중 오류 발생:`,
        error
      );
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
<<<<<<< HEAD
  const items = [
    getItem("All", "1", <HeartOutlined />),
    getItem("Daily", "2", <UserOutlined />),
    getItem("Politics", "3", <RadarChartOutlined />),
    getItem("Sports", "4", <FireOutlined />),
  ];
=======

  const handleFollow = async (author) => {
    try {
      const token = localStorage.getItem("token");
      const follower_id = localStorage.getItem("author");

      if (!token) {
        console.log("User not logged in");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}api/follow/`,
        { following_id: author, follower_id: follower_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Success") {
        const isFollowing = response.data.is_following;

        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [author]: isFollowing,
        }));

        fetchXfilterList();
        console.log(isFollowing ? "Followed" : "Unfollowed");
      } else {
        console.error("Follow request failed");
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

>>>>>>> main
  useEffect(() => {
    fetchXfilterList();
    fetchUserInfoAndSaveToLocalStorage();
    fetchFollowingUsers();
    const storedFollowStatus = JSON.parse(localStorage.getItem("followStatus")) || {};
    setFollowStatus(storedFollowStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem("followStatus", JSON.stringify(followStatus));
  }, [followStatus]);

  const fetchFollowingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}api/get_following_users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowingUsers(response.data);

      const updatedFollowStatus = response.data.reduce(
        (status, user) => ({
          ...status,
          [user.full_name]: true,
        }),
        {}
      );
      setFollowStatus(updatedFollowStatus);
    } catch (error) {
      console.error("Error fetching following users:", error);
    }
  };

  const fetchPostsFromUser = async (username, userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}board/xfilter/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          author_name: username,
        },
      });
      setXfilterList(response.data);
    } catch (error) {
      console.error("Error fetching posts from user:", error);
    }
  };


  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <FloatButton
        style={{
          marginBottom:40,
          marginRight: 250,
          width: 60,
          height: 60,
        }}
        type="primary"
        onClick={handleFloatButtonClick}
        tooltip={<div>새 게시물 작성</div>}
      />
       <div
        style={{
          width: collapsed ? "80px" : "200px",
          height: "100vh",
          backgroundColor: "#001529",
          position: "fixed",
          left: 0,
        }}
      >
        <Link to="/newboard">
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
        </div>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, marginRight:200, height: "100vh" }}>
        <Header
          style={{
            backgroundColor: "#ffff",
            width: "100%",
          }}
        >
          <div className={styles.headerContainer}>
            <div className={styles.searchContainer}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Title, Author Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.bord_btn} onClick={handleSearch}>
                Search
              </button>
            </div>
            <div>
              <Link to="/">
                <button className={styles.logout}>로그아웃</button>
              </Link>
            </div>
          </div>
        </Header>

        <Content
          style={{
            overflow: "auto",
            width: "100%",
            height: "calc(100vh - 64px)",
            paddingTop: 20,
          }}
        >
<<<<<<< HEAD
          <Row >
            {xfilterList.map((xfilter, index) => (
              <Col
                span={12}
                key={xfilter.id}
                style={{ display: "flex", justifyContent: "center", width:'auto' }}
              >
                <Card
                  onClick={() => navigate(`/detail/${xfilter.id}`)}
                  title={xfilter.author}
                  className={`${styles.cardHoverEffect} ${
                    styles[`category${xfilter.category || "Default"}`]
                  }`}
                  style={{
                    marginBottom: 30,
                    width: 600,
                    height: 400,
                  }}
                >
                  {xfilter.content.length > 20
                    ? `${xfilter.content.substring(0, 40)}...`
                    : xfilter.content}
                </Card>
              </Col>
            ))}
          </Row>
=======
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          ></Breadcrumb>
          {xfilterList.map((xfilter) => (
            <Card
              key={xfilter.id}
              onClick={() => navigate(`/detail/${xfilter.id}`)}
              className={styles.cardHoverEffect}
              style={{
                marginLeft: "30%",
                marginTop: 20,
                width: 700,
                height: 400,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3>{xfilter.author}</h3>
                  {xfilter.content.length > 20 ? (
                    <p>{`${xfilter.content.substring(0, 40)}...`}</p>
                  ) : (
                    <p>{xfilter.content}</p>
                  )}
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(xfilter.author);
                    }}
                    className={styles.followButton}
                  >
                    {followStatus[xfilter.author] ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </Card>
          ))}
>>>>>>> main
        </Content>
        <div className={styles.followingContainer}>
          <h3>Following</h3>
          <ul>
            {followingUsers.map((user) => (
              <li key={user.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchPostsFromUser(user.full_name, user.id);
                  }}
                >
                  {user.full_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Footer
          style={{
            width:"auto",
            textAlign: "center",
          }}
        >
          경빈's Design ©2023 Created by SeHuuuui
        </Footer>
      </Layout>
      <div
        style={{
          width: collapsed ? "80px" : "200px",
          height: "100vh",
          backgroundColor: "#001529",
          position: "fixed",
          right: 0,
        }}
      ><p className={styles.siderp}>팔로우목록</p></div>
              <div
        style={{
          width: collapsed ? "80px" : "200px",
          height: "100vh",
          backgroundColor: "#001529",
          position: "fixed",
          right: 0,
        }}
      ><p className={styles.siderp}>팔로우목록</p></div>
    </Layout>
  );
};

export default Newboard;
