import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DetailBoard.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  postComment,
  editBoard,
  deleteBoard,
  recommendBoard,
  editComment,
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
  }, [xfilter_id, token]);

  const handledeleteBoard = async () => {
    try {
      const postId = xfilter.id; // Assuming xfilter has an 'id'
      const response = await deleteBoard(postId);
      console.log(response);
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  const handlerecommendBoard = async () => {
    const type = 'post';
    try {
      const postId = xfilter.id; // Assuming xfilter has an 'id'
      const response = await recommendBoard(type, postId);
      console.log(response);
    } catch (error) {
      console.error('게시글 추천 오류:', error);
    }
  };

  const handlepostComment = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;

    try {
      const postId = xfilter.id; // Assuming xfilter has an 'id'
      const response = await postComment(content, postId);
      console.log(response);
    } catch (error) {
      console.error('댓글 제출 오류:', error);
    }
  }

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!xfilter) {
    return <div>No data available</div>;
  }

  return (
    <div className="container my-3" style={{ backgroundColor: 'white', color: 'black' }}>
      <div className="top section">
        <div>
          <label htmlFor="content" className="form-label">제목</label>
          <p>{xfilter.title}</p>
        </div>
        <button onClick={handlerecommendBoard} className="btn btn-outline-success mx-2">
          추천하기
        </button>

        <div className={styles.actionButtons}>
          <button onClick={handledeleteBoard} className="btn btn-outline-danger">
            삭제
          </button>
        </div>
      </div>

      <div className="bottom-section">
        <div>
          <label htmlFor="content" className="form-label">작성자</label>
          <p>{xfilter.author}</p>
        </div>
        <div>
          <label htmlFor="content" className="form-label">작성일시</label>
          <p>{xfilter.create_date}</p>
        </div>
        <div>
          <label htmlFor="content" className="form-label">내용</label>
          <p>{xfilter.content}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailBoard;
