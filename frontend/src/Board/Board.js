import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FloatButton } from 'antd';
import styles from './Board.module.css';
import { get_user_info } from '../api';

const BASE_URL = 'http://localhost:8000/';

const Board = () => {
    
    const handleFloatButtonClick = () => {
        // 예: 새 게시물 작성 페이지로 이동
        navigate('/makeboard');
    };

    const [xfilterList, setXfilterList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchXfilterList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}board/xfilter/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setXfilterList(response.data);
        } catch (error) {
            console.error('Error fetching xfilters:', error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchTerm.trim() !== '') {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${BASE_URL}board/xfilter/?kw=${searchTerm}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setXfilterList(response.data);
            } else {
                fetchXfilterList();
            }
        } catch (error) {
            console.error('Error fetching filtered xfilters:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleString('ko-KR', options);
    };

    const fetchUserInfoAndSaveToLocalStorage = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await get_user_info(token); 

                const fullName = userData.full_name;

                if (fullName) {
                    localStorage.setItem('author', fullName);
                }
            } else {
                console.error('토큰이 존재하지 않습니다.');
            }
        } catch (error) {
            console.error('사용자 정보를 가져오는 데 문제가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchXfilterList();
        fetchUserInfoAndSaveToLocalStorage(); 
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
            <FloatButton style={{
            marginRight:40,
          width: 60,
          height: 60,
        }}type="primary" onClick={handleFloatButtonClick} tooltip={<div>새 게시물 작성</div>} />
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
                    {xfilterList.map((xfilter) => (
                        <tr
                            className="text-center"
                            key={xfilter.id} 
                            onClick={() => navigate(`/detail/${xfilter.id}`)} 
                        >
                            <td>{xfilter.id}</td>
                            <td className="text-start">
                                {xfilter.content.length > 20 ? `${xfilter.content.substring(0, 40)}...` : xfilter.content}
                            </td>
                            <td>{xfilter.author}</td>
                            <td>{formatDate(xfilter.create_date)}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Board;