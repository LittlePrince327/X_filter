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
  BugOutlined,
} from "@ant-design/icons";
import { Card, Layout, Menu, theme, Input } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./DetailBoard.module.css";
import {
  postComment,
  deleteBoard,
  recommendBoard,
  deleteComment,
  recommendComment,
} from "../api";
import logo from "./logo100.png";

const { TextArea } = Input;
const BASE_URL = "http://localhost:8000/";
const { Header, Content, Footer } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}


const DetailBoard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [xfilterList, setXfilterList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followStatus, setFollowStatus] = useState({});
  const [followingUsers, setFollowingUsers] = useState([]);


  // 게시글 데이터 불러오기
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


  // 검색 기능 ("/board" 페이지에서만 실행)
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


  useEffect(() => {
    fetchXfilterList();
    fetchFollowingUsers();
    const storedFollowStatus =
      JSON.parse(localStorage.getItem("followStatus")) || {};
    setFollowStatus(storedFollowStatus);
  }, []);

  useEffect(() => {
    localStorage.setItem("followStatus", JSON.stringify(followStatus));
  }, [followStatus]);


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


  // 
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


  const { id: xfilter_id } = useParams();
  const [xfilter, setXfilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);
  const [xfilterLikesCount, setXfilterLikesCount] = useState(0);
  const [commentLikesCounts, setCommentLikesCounts] = useState({});


  const fetchXfilter = async () => {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${BASE_URL}board/xfilter/${xfilter_id}/`,
          config
        );
        setXfilter(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching xfilter:", error);
        setIsLoading(false);
      }
    } else {
      console.error("Token not found in localStorage");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchXfilter();
    fetchComments();
    fetchLikesCount();
    if (commentUpdated) {
      window.location.reload();
    }
  }, [xfilter_id, token, commentUpdated]);

  useEffect(() => {
    fetchLikesCount();
  }, [xfilter_id, token]);

  useEffect(() => {
    if (xfilter && comments.length > 0) {
      fetchLikesCount();
    }
  }, [xfilter, comments, token]);



  const fetchLikesCount = async () => {
    try {
      const xfilterLikesResponse = await axios.get(`${BASE_URL}board/xfilter/like/${xfilter_id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setXfilterLikesCount(xfilterLikesResponse.data.likes_count);
      const commentLikesPromises = comments.map(async (comment) => {
        const commentLikesResponse = await axios.get(`${BASE_URL}board/comment/like/${comment.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return { commentId: comment.id, likesCount: commentLikesResponse.data.likes_count };
      });

      const commentLikes = await Promise.all(commentLikesPromises);
      const commentLikesCountMap = {};
      commentLikes.forEach((item) => {
        commentLikesCountMap[item.commentId] = item.likesCount;
      });
      setCommentLikesCounts(commentLikesCountMap);
    } catch (error) {
      console.error('Likes count fetching error:', error);
    }
  };



  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `${BASE_URL}board/xfilter/comment?xfilter_id=${xfilter_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    }
  };



  const handledeleteBoard = async () => {
    const userToken = localStorage.getItem("token");
    const postId = xfilter.id;
    try {
      const response = await deleteBoard(postId, userToken);
      console.log(response.data);
      navigate('/board');
    } catch (error) {
      console.error(
        "게시물 삭제 중 오류:",
        error.response ? error.response.data : error.message
      );
    }
  };



  const handlerecommendBoard = async () => {
    try {
      const postId = xfilter.id;
      const author = localStorage.getItem('author');
      const postResponse = await recommendBoard(postId, token, author);

      const getResponse = await axios.get(`${BASE_URL}board/xfilter/like/${postId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedLikesCount = getResponse.data.likes_count;
      setXfilterLikesCount(updatedLikesCount);
    } catch (error) {
      console.error('게시글 추천 오류:', error);
    }
  };



  const handlePostComment = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem("author");
    const create_date = new Date().toISOString();

    try {
      const data = await postComment(
        content,
        author,
        create_date,
        xfilter_id,
        token
      );
      console.log("댓글 작성 완료:", data);
      event.target.content.value = "";
      setIsCommenting(false);
      setCommentUpdated(true);
      updateComments(xfilter.id);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };



  const updateComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const commentsResponse = await axios.get(
        `${BASE_URL}board/xfilter/comment?xfilter_id=${xfilter_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("댓글 업데이트 오류:", error);
    }
  };



  const handledeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId, token);
      console.log(response.data);
      updateComments();
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };


  const handlerecommendComment = async (commentId) => {
    try {
      const author = localStorage.getItem('author');
      const response = await recommendComment(commentId, author, token);

      const updatedCommentLikesResponse = await axios.get(`${BASE_URL}board/comment/like/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommentLikesCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: updatedCommentLikesResponse.data.likes_count,
      }));
      console.log(response);
    } catch (error) {
      console.error('댓글 추천 오류:', error);
    }
  };

  // 로그아웃시 로컬스토리지 데이터 초기화
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!xfilter) {
    return <div>No data available</div>;
  }

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
        <Link to="/board">
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
        <Menu
          className={styles.menu}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          selectedKeys={[selectedCategory]}
        ></Menu>
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
            overflow: "auto",
            width: "100%",
            paddingTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "800px", width: "100%", height: "auto" }}>
            <Card
              title={
                <div
                  style={{
                    height: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                  bordered={false}
                >
                  <span>{xfilter.author}</span>
                  <tr />
                  <p className={styles.cardcate}>{xfilter.category}</p>
                  <p className={styles.date}>
                    {formatDate(xfilter.create_date)}
                  </p>
                  {localStorage.getItem("author") === xfilter.author && (
                    <button onClick={handledeleteBoard} className={styles.del}>
                      삭제하기
                    </button>
                  )}
                </div>
              }
              bordered={false}
              className={styles.boardcard}
            >
              <div className={styles.contentbox}>{xfilter.content}</div>
              <div className={styles.likeContainer}>
                <button onClick={handlerecommendBoard} className={styles.like}>
                  좋아요❤️ {xfilterLikesCount}
                </button>
              </div>

              <form onSubmit={handlePostComment} className={styles.comment}>
                <TextArea
                  style={{
                    width: 660,
                    height: 50,
                  }}
                  name="content"
                  id="content"
                  placeholder="Controlled autosize"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />

                <button type="submit" className={styles.inputbtn}>
                  댓글<tr></tr>등록
                </button>
              </form>
              {comments.map((comment) => (
                <Card
                  title={
                    <div
                      style={{
                        height: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}

                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>{comment.author}</span>
                        <tr />
                        <p className={styles.commentdate}>
                          {formatDate(comment.create_date)}
                        </p>

                      </div>
                      <div>
                        {localStorage.getItem("author") === comment.author && (
                          <button
                            onClick={() => handledeleteComment(comment.id)}
                            className={styles.commentdel}
                          >
                            댓글 삭제
                          </button>
                        )}
                        <button
                          onClick={() => handlerecommendComment(comment.id)}
                          className={styles.commentlike}
                        >
                          추천💙 {commentLikesCounts[comment.id] || 0}
                        </button>
                      </div>
                    </div>
                  }
                  bordered={false}
                  style={{ width: "auto", marginTop: 10, background: "#ededed" }}
                >
                  <div>
                    <p>{comment.content}</p>
                  </div>
                </Card>
              ))}
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

export default DetailBoard;
