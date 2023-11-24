import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DesktopOutlined,
  RadarChartOutlined,
  HeartOutlined,
  ExperimentOutlined,
  UserOutlined,
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
  Layout,
  Menu,
  Card,
  Row,
  Col,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Board.module.css";
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


const BASE_URL = "http://localhost:8000/";
const { Header, Content, Footer } = Layout;                     

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
  getItem("My List", "1", <UserOutlined />),
  getItem("All", "2", <HeartOutlined />),
  getItem("Daily", "3", <UserOutlined />),
  getItem("Politics", "4", <RadarChartOutlined />),
  getItem("Sports", "5", <TrophyOutlined />),
  getItem("Technology", "6", <DesktopOutlined />),
  getItem("Entertainment", "7", <StarOutlined />),
  getItem("Science and Nature", "8", <ExperimentOutlined />),
  getItem("Gaming", "9", <LikeOutlined />),
  getItem("Books and Literature", "10", <ReadOutlined />),
  getItem("Health and Fitness", "11", <MedicineBoxOutlined />),
  getItem("Travel", "12", <CarOutlined />),
  getItem("Food and Cooking", "13", <CoffeeOutlined />),
  getItem("Art and Creativity", "14", <HighlightOutlined />),
  getItem("Technology Help/Support", "15", <BugOutlined />),
];

const Board = () => {
  const [collapsed, setCollapsed] = useState(false);                            
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



  // 게시글 불러오기
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



  // 게시글 검색
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


  // 카테고리별 게시글 불러오기
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
      } else if (category === "My List") {
        const authorName = localStorage.getItem("author");
        response = await axios.get(
          `${BASE_URL}board/xfilter/?author_name=${authorName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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


  // 로그인 사용자 정보 로컬스토리지에 저장
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


  // 팔로우 기능
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


  // 팔로우 목록 불러오기
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


  // 팔로우중인 사용자가 작성한 게시글 불러오기
  const fetchPostsFromUser = async (username) => {
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


  // 게시글별 댓글 개수 표시
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


  // 게시글별 좋아요 개수 표시
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

  // 로그아웃시 로컬스토리지 데이터 초기화
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
    "Books and Literature": "#BFE6F5",
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
        <Link to="/board">
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
                width: 250
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
              <button className={styles.logout} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        </Header>

        <Content
          style={{
            marginLeft: 30,
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
                    width: 500,
                    height: 400,
                    backgroundColor: categoryColors[xfilter.category] || "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ height: 120 }}>
                      {xfilter.content.length > 20 ? (
                        <p>{`${xfilter.content.substring(0, 50)}...`}</p>
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
                        <br />
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
          ⓒ XNS Company. All Rights Reserved.
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
        <p className={styles.siderp}>
          팔로우목록 ({followingUsers.length})
        </p>
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

export default Board;
