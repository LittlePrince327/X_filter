import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DesktopOutlined,
  RadarChartOutlined,
  HeartOutlined,
  ExperimentOutlined,
  UserOutlined,
  AudioOutlined,
  LikeOutlined,
  StarOutlined,
  ReadOutlined,
  MedicineBoxOutlined,
  TrophyOutlined,
  CarOutlined,
  CoffeeOutlined,
  HighlightOutlined,
  BugOutlined
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
  Modal
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Newboard.module.css";
import { get_user_info } from "../api";
import logo from "./logo100.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import image2 from "../images/image2.png";
import image1 from "../images/image1.png";
import image3 from "../images/image3.png";
import image4 from "../images/image4.png";
import image5 from "../images/image5.png";
import image6 from "../images/image6.png";
import image7 from "../images/image7.png";
import image8 from "../images/image8.png";
import image9 from "../images/image9.png";
import image10 from "../images/image10.png";
// import image11 from "../images/image11.png";
// import image12 from "../images/image12.png";
// import image13 from "../images/image13.png";
// import image14 from "../images/image14.png";
// import image15 from "../images/image15.png";
// import image16 from "../images/image16.png";
// import image17 from "../images/image17.png";
// import image18 from "../images/image18.png";

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

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const authorImageMap = {};

const renderImage = (author) => {
  const storedImage = localStorage.getItem(`authorImage_${author}`);
  if (storedImage) {
    return storedImage;
  } else {
    if (!authorImageMap[author]) {
      authorImageMap[author] = getRandomImage();
    }
    localStorage.setItem(`authorImage_${author}`, authorImageMap[author]);
    return authorImageMap[author];
  }
};

const getRandomImage = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const items = [
  getItem("All", "1", <HeartOutlined />),
  getItem("Daily", "2", <UserOutlined />),
  getItem("Politics", "3", <RadarChartOutlined />),
  getItem("Sports", "4", <TrophyOutlined />),
  getItem("Technology", "5", <DesktopOutlined />),
  getItem("Entertainment", "6", <StarOutlined />),
  getItem("Science and Nature", "7", <ExperimentOutlined />),
  getItem("Gaming", "8", <LikeOutlined />),
  getItem("Books and Literature", "9", <ReadOutlined />),
  getItem("Health and Fitness", "10", <MedicineBoxOutlined />),
  getItem("Travel", "11", <CarOutlined />),
  getItem("Food and Cooking", "12", <CoffeeOutlined />),
  getItem("Art and Creativity", "13", <HighlightOutlined />),
  getItem("Technology Help/Support", "14", <BugOutlined />),
];

const Newboard = () => {
  const [modal2Open, setModal2Open] = useState(false);
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
  const [likesCount, setLikesCount] = useState({});

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
      console.log(response.data);
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

  const fetchLikesCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const counts = {};

      for (const xfilter of xfilterList) {
        const response = await axios.get(
          `${BASE_URL}board/xfilter/like/${xfilter.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        counts[xfilter.id] = response.data.likes_count;
      }
      setLikesCount(counts);
    } catch (error) {
      console.error("Error fetching likes counts:", error);
    }
  };

  useEffect(() => {
    fetchXfilterList();
    fetchUserInfoAndSaveToLocalStorage();
    fetchFollowingUsers();
    fetchCommentCounts();
    fetchLikesCount();
    const storedFollowStatus = JSON.parse(localStorage.getItem("followStatus")) || {};
    setFollowStatus(storedFollowStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem("followStatus", JSON.stringify(followStatus));
  }, [followStatus]);

  useEffect(() => {
    fetchCommentCounts();
    fetchLikesCount();
  }, [xfilterList]);

  const categoryColors = {
    "Daily": "#FEE7E4",
    "Politics": "#E4FBEF",
    "Sports": "#E0F3FB",
    "Technology": "#FEF6E7",
    "Entertainment": "#E9D9FF",
    "Science and Nature": "#FFFCD9",
    "Gaming": "#FFD9FD",
    "Books and Literature": "#FEE7E0",
    "Health and Fitness": "#E3F0D8",
    "Travel": "#C7D0F1",
    "Food and Cooking": "#F1E3C7",
    "Art and Creativity": "#DDDDDD",
    "Technology Help/Support": "#D2EEFF"
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <FloatButton
        style={{
          marginBottom: 40,
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
          width: collapsed ? "80px" : "250px",
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
              style={{
                width:250
              }}
              key={item.key}
              icon={item.icon}
              onClick={() => handleCategoryChange(item.label)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          marginRight: 200,
          height: "100vh",
        }}
      >
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
            marginLeft:30,
            overflow: "auto",
            width: "100%",
            height: "calc(100vh - 64px)",
            paddingTop: 20,
          }}
        >
          <Row>
            {xfilterList.map((xfilter, index) => (
              <Col
                span={12}
                key={xfilter.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "auto",
                }}
              >
                <Card
                  className={styles.cardHoverEffect}
                  onClick={() => navigate(`/detail/${xfilter.id}`)}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",

                      }}
                    >
                      <div className={styles.image_container}>
                        <img
                          src={renderImage(xfilter.author)}
                          alt={`Image ${index + 1}`}
                        />
                      </div>
                      <div className={styles.xfilter_author}>{xfilter.author}</div>
                      <tr />
                      <p
                        className={styles.cardcate}>{xfilter.category}</p>
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
                  }
                  style={{
                    marginBottom: 30,
                    width: 600,
                    height: 400,
                    backgroundColor: categoryColors[xfilter.category] || "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      {xfilter.content.length > 20 ? (
                        <p>{`${xfilter.content.substring(0, 40)}...`}</p>
                      ) : (
                        <p>{xfilter.content}</p>
                      )}

                    </div>
                    <div className={styles.commentcounts}>
                      <p>
                        {commentCounts[xfilter.id] === 0 && ""}
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
                        <br/>
                        {likesCount[xfilter.id] > 0 && (
                          <>
                            <LikeOutlined /> {likesCount[xfilter.id]} 좋아요
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
        <Footer
          style={{
            width: "auto",
            textAlign: "center",
          }}
        >
          XNS Design ©2023 Created by XNS Designer
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
      >
        <p className={styles.siderp}>팔로우목록</p>
        <ul>
          {followingUsers.map((user) => (
            <li key={user.id} className={styles.followli} data-icon="🤍">
              <a
                className={styles.followa}
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
    </Layout>
  );
};

export default Newboard;
