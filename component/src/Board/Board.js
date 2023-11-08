import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

const BASE_URL = 'http://localhost:8000/';

const Board = () => {
    const [xfilterList, setXfilterList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchXfilterList = async (term) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage (replace 'authToken' with your key)
            const response = await axios.get(`${BASE_URL}board/xfilter/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the JWT token in the request headers
                }
            });
            setXfilterList(response.data);
        } catch (error) {
            console.error('Error fetching xfilters:', error);
        }
    };

    const handleSearch = () => {
        fetchXfilterList(searchTerm);
    };

    useEffect(() => {
        fetchXfilterList(''); // Fetch xfilter list on initial load
    }, []);

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
                            onClick={() => navigate(`/detail/${xfilter.id}`)} // You can set your route for detailed view
                        >
                            <td>{xfilter.id}</td>
                            <td className="text-start">
                                {xfilter.content}
                            </td>
                            <td>{xfilter.author}</td>
                            <td>{xfilter.create_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Board;
