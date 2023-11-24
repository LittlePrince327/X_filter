import React, { useState, useEffect, useMemo } from "react";
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
  BugOutlined,
  CheckOutlined,
  SmileFilled,
  SmileOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Input,
  Space,
  Tag,
  Alert,
  Button,
  Card,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MakeBoard.module.css";
import { get_user_info, postBoard } from "../api";
import logo from "./logo100.png";
import Marquee from "react-fast-marquee";

const { Paragraph } = Typography;
const { CheckableTag } = Tag;
const tagsData = [
  "All",
  "Daily",
  "Politics",
  "Sports",
  "Technology",
  "Entertainment",
  "Science and Nature",
  "Gaming",
  "Books and Literature",
  "Health and Fitness",
  "Travel",
  "Food and Cooking",
  "Art and Creativity",
  "Technology Help/Support",
];
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
const { Header, Content, Footer } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
const { TextArea } = Input;
const onChange = (e) => {
  console.log("Change:", e.target.value);
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

const Makeboard = () => {
  const [userToken, setUserToken] = useState("");
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log("You are interested in: ", nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  useEffect(() => {
    // Any additional setup you want to perform on component mount
  }, []);

  const handlepostBoard = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem("author");
    const create_date = new Date().toISOString();
    const category = selectedTags[0] || "All"; // Default to 'All' if no category is selected

    try {
      const response = await postBoard(
        content,
        author,
        create_date,
        category,
        userToken
      );
      console.log(response);
      navigate("/newboard");
    } catch (error) {
      console.error("게시물 제출 오류:", error);
    }
  };
  const [modal2Open, setModal2Open] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  useEffect(() => {
    fetchXfilterList();
    fetchUserInfoAndSaveToLocalStorage();
    fetchFollowingUsers();
    fetchCommentCounts();
    const storedFollowStatus =
      JSON.parse(localStorage.getItem("followStatus")) || {};
    setFollowStatus(storedFollowStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem("followStatus", JSON.stringify(followStatus));
  }, [followStatus]);

  useEffect(() => {
    fetchCommentCounts();
  }, [xfilterList]);

  const categoryColors = {
    Daily: "#FEE7E4",
    Politics: "#E4FBEF",
    Sports: "#E0F3FB",
    Technology: "#FEF6E7",
    Entertainment: "#E9D9FF",
    "Science and Nature": "#FFFCD9",
    Gaming: "#FFD9FD",
    "Books and Literature": "#FEE7E0",
    "Health and Fitness": "#E3F0D8",
    Travel: "#C7D0F1",
    "Food and Cooking": "#F1E3C7",
    "Art and Creativity": "#DDDDDD",
    "Technology Help/Support": "#D2EEFF",
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
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
            overflow: "auto",
            width: "100%",
            height: "calc(100vh - 64px)",
            paddingTop: 20,
          }}
        >
          <Alert
            type="error"
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                XNS는 자동으로 문장을 필터링하여 욕설과 혐오표현을 포함한
                부적절한 언어를 제거합니다. &nbsp;&nbsp;
                XNS는 모든 사용자들이 존중받는 커뮤니티를 조성하는 것을 목표로 합니다.
              </Marquee>
            }
          />
          <div
            style={{
              margin: "20px 30px 0px 40px",
            }}
          >
            카테고리:&nbsp;&nbsp;
            <Space size={[0, 8]} wrap>
              {tagsData.map((tag) => (
                <CheckableTag
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}
            </Space>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: 100,
              marginTop: 60,
            }}
          >
            <form onSubmit={handlepostBoard} style={{ marginRight: "20px" }}>
              <div className={styles.posttitle}>
                어떤이야기를 들려주실건가요?
              </div>
             
              <div className={styles.textarea}>
                <TextArea
                  showCount
                  name="content" // 이 부분이 중요합니다
                  id="content"
                  maxLength={400}
                  onChange={onChange}
                  placeholder="400자 이내로 작성가능"
                  style={{
                    width: 700,
                    height: 500,
                    resize: "none",
                    marginLeft: 50,
                    fontSize: 15,
                  }}
                />
              </div>
              <button type="submit" className={styles.postbtn2}>
                  게시하기
                </button>
              <Button type="primary" danger>
                필터링하기
              </Button>
                {/* <Button type="primary" disabled>
                게시불가
              </Button>          */}
            </form>
            <Card
              title="필터링된 문장"
              extra={
                <div>
                  {" "}
                  <Paragraph
                    copyable={{ text: "복사된문장" }}
                    style={{
                      margin: "auto",}}
                  >
                    복사하기
                  </Paragraph>
                </div>
              }
              style={{
                marginTop: 45,
                width: "100%",
                height: 500,
              }}
            >
              <p>아 오늘 점심 먹으러 충장로 나왔는데
사람 진짜 많더라 .. 오늘 무슨 축제 있냐?
어째튼 심심한데 저녁에 영화볼 친구 구함 !!</p>
            </Card>
          </div>
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

export default Makeboard;
