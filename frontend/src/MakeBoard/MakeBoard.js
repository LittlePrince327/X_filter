import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './MakeBoard.module.css';
import { postBoard } from '../api';
import { Space, Tag } from 'antd';

const { CheckableTag } = Tag;
const tagsData = [
  'All', 'Daily', 'Politics', 'Sports',
  'Technology', 'Entertainment', 'Science and Nature', 
  'Gaming', 'Books and Literature', 'Health and Fitness',
  'Travel', 'Food and Cooking', 'Art and Creativity', 
  'Technology Help/Support'
];

const MakeBoard = () => {
  const [userToken, setUserToken] = useState('');
  const navigate = useNavigate(); 
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  useEffect(() => {
    // Any additional setup you want to perform on component mount
  }, []);

  const handlepostBoard = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const author = localStorage.getItem('author');
    const create_date = new Date().toISOString();
    const category = selectedTags[0] || 'All'; // Default to 'All' if no category is selected

    try {
      const response = await postBoard(content, author, create_date, category, userToken);
      console.log(response);
      navigate('/newboard'); 
    } catch (error) {
      console.error('게시물 제출 오류:', error);
    }
  };

  return (
    <div className="container my-3" style={{ backgroundColor: 'white' }}>
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
