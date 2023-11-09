import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './MakeBoard.module.css';
import { get_user_info, postBoard } from '../api';

const MakeBoard = () => {
  const postId = 123;
  const commentId = 456;
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Define navigate here

  useEffect(() => {
    // Your existing useEffect code
  }, []);

  // 게시글 작성
  const handlepostBoard = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem('author');
    const create_date = new Date().toISOString();

    try {
      const response = await postBoard(content, author, create_date, userToken);
      console.log(response);
      navigate('/board'); // Navigate after posting the board
    } catch (error) {
      console.error('게시물 제출 오류:', error);
    }
  };

  return (
    <div className="container my-3" style={{ backgroundColor: 'white' }}>
      <div className="top section">
        <form onSubmit={handlepostBoard}>
          <div>
            <label htmlFor="content" className="form-label">게시글</label>
            <textarea className="form-control" name="content" id="content" rows={10}></textarea>
          </div>
          <button type="submit" className="btn btn-primary my-2">게시하기</button>
        </form>
      </div>
    </div>
  );
};

export default MakeBoard;
