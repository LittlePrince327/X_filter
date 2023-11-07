import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

const Board = () => {
    const [xfilterList, setXfilterList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [currentPost, setCurrentPost] = useState(null); // Additional state for the selected post
    const [userInfo, setUserInfo] = useState(null); // State to hold user information

    const fetchXfilterList = async (term) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage

            const response = await axios.get(`http://localhost:8000/board/xfilter/?kw=${term}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Send the token in the request header
                }
            });
            setXfilterList(response.data);
        } catch (error) {
            console.error('Error fetching xfilters:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // 이 위치에 console.log를 추가하여 토큰 확인
        if (token) {
            // Fetch user information using the token
            axios.get('http://localhost:8000/api/get_user_info/', {
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token in the request header
                },
            })
            .then((response) => {
                setUserInfo(response.data); // Update the user information state
            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
            });
        }
    }, []);



    const handleSearch = () => {
        fetchXfilterList(searchTerm);
    };

    const handleXfilterClick = (id) => {
        // Define the behavior when an xfilter is clicked
        // This could be a navigation, updating state, or making an API call
        // For now, let's log the clicked xfilter ID
        console.log(`Clicked xfilter ID: ${id}`);
    };


    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className="col-6">
                    <button
                        className={`${styles.customBtn} btn btn-primary`}
                        type="button"
                        onClick={() => navigate('/detail')}
                    >
                        게시글 작성하기
                    </button>
                </div>
                <div className="col-6">
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={`${styles.searchInput} form-control`}
                            placeholder="검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className={`${styles.searchBtn} btn btn-outline-secondary`}
                            type="button"
                            onClick={handleSearch}
                        >
                            검색
                        </button>
                    </div>
                </div>
            </div>
            <table className={`table ${styles.table}`}>
                <thead>
                    <tr className="text-center table-dark">
                        <th>게시글 번호</th>
                        <th style={{ width: '50%' }}>제목</th>
                        <th>작성자</th>
                        <th>작성일시</th>
                    </tr>
                </thead>
                <tbody>
                    {xfilterList.map((xfilter, index) => (
                        <tr
                            className="text-center"
                            key={xfilter.id}
                            onClick={() => handleXfilterClick(xfilter.id)}
                        >
                            <td>{index + 1}</td>
                            <td className="text-start">
                                <a href={`#/${xfilter.id}`}>{xfilter.subject}</a>
                                {xfilter.comment_set.count > 0 && (
                                    <span className="text-danger small mx-2">
                                        {xfilter.comment_set.count}
                                    </span>
                                )}
                            </td>
                            <td>{xfilter.author.username}</td>
                            <td>{xfilter.create_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {currentPost && ( // 선택된 게시글 정보를 보여줌
                <div className={styles.currentPost}>
                    <h3>{currentPost.subject}</h3>
                    <p>{currentPost.content}</p>
                    <p>작성자: {currentPost.author.username}</p>
                    {/* 기타 원하는 정보들을 추가하세요 */}
                </div>
            )}
        </div>
    );
};

export default Board;
