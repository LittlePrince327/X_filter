import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DetailBoard.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  postComment,
  deleteBoard,
  recommendBoard,
  deleteComment,
  recommendComment
} from '../api';

const BASE_URL = 'http://localhost:8000/';

const DetailBoard = () => {
  const navigate = useNavigate();
  const { id: xfilter_id } = useParams();
  const [xfilter, setXfilter] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentId, setCommentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [showCommentTextarea, setShowCommentTextarea] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);

  const fetchXfilter = async () => {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const response = await axios.get(`${BASE_URL}board/xfilter/${xfilter_id}/`, config);
        setXfilter(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching xfilter:', error);
        setIsLoading(false);
      }
    } else {
      console.error('Token not found in localStorage');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchXfilter();
    fetchComments();
    if (commentUpdated) {
      window.location.reload();
    }
  }, [xfilter_id, token, commentUpdated]);


  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(`${BASE_URL}board/xfilter/comment?xfilter_id=${xfilter_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('댓글 불러오기 오류:', error);
    }
  };

  const handledeleteBoard = async () => {
    try {
      const postId = xfilter.id;
      const response = await deleteBoard(postId);
      console.log(response);
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  const handlerecommendBoard = async () => {
    const type = 'post';
    try {
      const postId = xfilter.id;
      const response = await recommendBoard(type, postId);
      console.log(response);
    } catch (error) {
      console.error('게시글 추천 오류:', error);
    }
  };

  const handlePostComment = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem('author');
    const create_date = new Date().toISOString();

    try {
      const data = await postComment(content, author, create_date, xfilter_id, token); 
      console.log('댓글 작성 완료:', data);
      event.target.content.value = '';
      setIsCommenting(false);
      setCommentUpdated(true);
      updateComments(xfilter.id); 
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const updateComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const commentsResponse = await axios.get(`${BASE_URL}board/xfilter/comment`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };



  const handledeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      console.log(response);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const handlerecommendComment = async (commentId) => {
    try {
      const response = await recommendComment(commentId);
      console.log(response);
    } catch (error) {
      console.error('댓글 추천 오류:', error);
    }
  };

  const handleShowCommentTextarea = () => {
    setShowCommentTextarea(true);
  };

  const handleCommentButton = () => {
    setIsCommenting(!isCommenting);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!xfilter) {
    return <div>No data available</div>;
  }


  return (
    <div className="container my-3" style={{ backgroundColor: 'white', color: 'black' }}>
      <div className="detail-container" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <div className="detail-section" style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="content" className="form-label">작성자</label>
            <p>{xfilter.author}</p>
          </div>
          <div className="detail-section" style={{ flex: 2, border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <label htmlFor="content" className="form-label">내용</label>
            <p>{xfilter.content}</p>
          </div>
          <div className="detail-section" style={{ flex: 1, marginLeft: '10px' }}>
            <label htmlFor="content" className="form-label">작성일시</label>
            <p>{formatDate(xfilter.create_date)}</p>
          </div>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className={styles.actionButtons}>
            <button onClick={handledeleteBoard} className="btn btn-outline-danger">
              삭제하기
            </button>
            <button onClick={handlerecommendBoard} className="btn btn-outline-success mx-2">
              추천하기
            </button>
            <button onClick={handleCommentButton} className="btn btn-primary mx-2">
              댓글 달기
            </button>
          </div>
        </div>
        <br />
        {isCommenting && (
          <form onSubmit={handlePostComment}>
            <div>
              <textarea className="form-control" name="content" id="content" rows={10}></textarea>
            </div>
            <button type="submit" className="btn btn-primary my-2">
              댓글 등록
            </button>
          </form>
        )}
        <div className="comment-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-box">
              <div>
                <p>
                  <strong>작성자: </strong>{comment.author}
                </p>
              </div>
              <div>
                <p>
                  <strong>내용: </strong>{comment.content}
                </p>
              </div>
              <div>
                <p>
                  <strong>작성일시: </strong>{formatDate(comment.create_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailBoard;