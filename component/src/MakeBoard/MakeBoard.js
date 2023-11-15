import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './MakeBoard.module.css';
import { postBoard } from '../api';
import { Space, Tag } from 'antd';

const { CheckableTag } = Tag;
const tagsData = ['Daily','Politics', 'Sports'];

const MakeBoard = () => {
  const postId = 123;
  const commentId = 456;
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 
  const [selectedTags, setSelectedTags] = useState(['Books']);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };
  useEffect(() => {
 
  }, []);


  const handlepostBoard = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem('author');
    const create_date = new Date().toISOString();

    try {
      const response = await postBoard(content, author, create_date, userToken);
      console.log(response);
      navigate('/newbord'); 
    } catch (error) {
      console.error('게시물 제출 오류:', error);
    }
  };

  return (
    <div className={styles.container} style={{ backgroundColor: 'white' }}>
       <span>

      </span>
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
      <div className={styles.top_section}>
        <form onSubmit={handlepostBoard}>
          <div>
            <label htmlFor="content" className={styles.form_label}>게시글</label>
            <textarea className="form-control" name="content" id="content" rows={10}></textarea>
          </div>
          <button type="submit" className="btn btn-primary my-2">게시하기</button>
        </form>
      </div>
    </div>
  );
};

export default MakeBoard;
