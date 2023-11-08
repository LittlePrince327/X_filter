// 이 코드는 게시글을 클릭했을 때 선택한 정보만 표시합니다.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DetailBoard.module.css';

const BASE_URL = 'http://localhost:8000/';

const DetailBoard = ({ xfilter_id }) => {
  const [xfilter, setXfilter] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchXfilter = async () => {
    try {
      const response = await axios.get(`${BASE_URL}board/xfilter/${xfilter_id}/`);
      setXfilter(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching xfilter:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchXfilter();
  }, [xfilter_id]);

  // 추가된 함수로 수정할 수 있습니다.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}board/xfilter/${xfilter_id}/comment/create`, {
        content: commentContent,
      });
      fetchXfilter();
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleModify = async () => {
    try {
      await axios.put(`${BASE_URL}board/xfilter/modify/${xfilter_id}`, /* updated data */);
      fetchXfilter();
    } catch (error) {
      console.error('Error modifying xfilter:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}board/xfilter/delete/${xfilter_id}`);
      // 삭제 이후의 네비게이션 또는 다른 액션을 처리할 수 있습니다.
    } catch (error) {
      console.error('Error deleting xfilter:', error);
    }
  };

  const handleRecommend = async () => {
    try {
      await axios.post(`${BASE_URL}board/xfilter/recommend/${xfilter_id}`);
      fetchXfilter();
    } catch (error) {
      console.error('Error recommending xfilter:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!xfilter) {
    return <div>No data available</div>;
  }

  return (
    <div className="container my-3">
      <h2 className="border-bottom py-2">Xfilter Details</h2>
      <div className="card my-3">
        <div className="card-body">
          <div className="card-text">{xfilter.content}</div>
          <div className="d-flex justify-content-end">
            <div className="badge bg-light text-dark p-2 text-start">
              <div className="mb-2">{xfilter.author}</div>
              <div>{xfilter.create_date}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3">
        <button className="btn btn-primary" onClick={handleModify}>
          수정하기
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          삭제하기
        </button>
        <button className="btn btn-success" onClick={handleRecommend}>
          추천하기
        </button>
      </div>
      <form onSubmit={handleCommentSubmit} className="my-3">
        <div className="mb-3">
          <label htmlFor="commentContent" className="form-label">
            댓글 작성
          </label>
          <textarea
            name="content"
            id="commentContent"
            className="form-control"
            rows="3"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          ></textarea>
        </div>
        <input type="submit" value="댓글 등록" className="btn btn-primary" />
      </form>
    </div>
  );
};

export default DetailBoard;
