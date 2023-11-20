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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

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
    navigate("/makeboard");
  };

  const [xfilterList, setXfilterList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followStatus, setFollowStatus] = useState({});
  const [followingUsers, setFollowingUsers] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});

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

  const fetchCommentCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const counts = {};

      for (const xfilter of xfilterList) {
        const response = await axios.get(
          `${BASE_URL}board/xfilter/comments_count/${xfilter.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        counts[xfilter.id] = response.data.comment_count;
      }
      setCommentCounts(counts);
    } catch (error) {
      console.error("Error fetching comment counts:", error);
    }
  };

  useEffect(() => {
    fetchXfilterList();
    fetchUserInfoAndSaveToLocalStorage();
    fetchFollowingUsers();
    fetchCommentCounts();
    const storedFollowStatus = JSON.parse(localStorage.getItem("followStatus")) || {};
    setFollowStatus(storedFollowStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem("followStatus", JSON.stringify(followStatus));
  }, [followStatus]);

  useEffect(() => {
    fetchCommentCounts();
  }, [xfilterList]);



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
                  <p>
                    {commentCounts[xfilter.id] === 0 && "댓글이 없습니다"}
                    {commentCounts[xfilter.id] === 1 && (
                      <>
                        <FontAwesomeIcon icon={faComment} /> 1 댓글
                      </>
                    )}
                    {commentCounts[xfilter.id] > 1 && (
                      <>
                        <FontAwesomeIcon icon={faComment} /> {commentCounts[xfilter.id]} 댓글
                      </>
                    )}
                  </p>
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
            textAlign: "center",
          }}
        >
          XNS Design ©2023 Created by XNS Designer
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Newboard;
