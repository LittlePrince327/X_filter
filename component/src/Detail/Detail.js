import React, { useState, useEffect } from 'react';
import styles from './Detail.module.css';
import axios from 'axios';
import {postBoard} from '../api';

const BASE_URL = 'http://localhost:8000';

const Detail = () => {
    const postId = 123;
    const commentId = 456;
    const [userToken, setUserToken] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get_user_info/`, {
                    headers: {
                        Authorization: `Bearer ${tokenFromStorage}`,
                    },
                });

                if (response.data.full_name) {
                    localStorage.setItem('full_name', response.data.full_name);
                }

                setUserData(response.data);
            } catch (error) {
                console.error('사용자 정보를 불러오는 중 오류 발생:', error);
            }
        };

        if (tokenFromStorage) {
            setUserToken(tokenFromStorage);
            fetchUserInfo();
        }
    }, []);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        const content = event.target.content.value;
        const author = localStorage.getItem('full_name'); // full_name 값을 author 변수에 할당
        const create_date = new Date().toISOString(); // 현재 시간을 ISO 문자열로 변환하여 create_date에 할당
        
        try {
            const response = await postBoard(content, author, create_date, userToken);    
            console.log(response);
        } catch (error) {
            console.error('게시물 제출 오류:', error);
        }
        
    }

        const handleCommentSubmit = (event) => {
            event.preventDefault();
            const content = event.target.content.value;

            axios.post(`http://localhost:8000/board/comment/create/${postId}/`, { content }, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    console.log('댓글 제출 응답:', response);
                })
                .catch(error => {
                    console.error('댓글 제출 오류:', error);
                });
        };

        const handleEdit = (type, id) => {
            const url = type === 'post' ? `http://localhost:8000/board/xfilter/modify/${id}/` : `http://localhost:8000/board/comment/modify/${id}/`;

            axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.log(`${item} 수정 응답:`, response);
                })
                .catch(error => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.error(`${item} 수정 오류:`, error);
                });
        };

        const handleDelete = (type, id) => {
            const url = type === 'post' ? `http://localhost:8000/board/xfilter/delete/${id}/` : `http://localhost:8000/board/comment/delete/${id}/`;

            axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.log(`${item} 삭제 응답:`, response);
                })
                .catch(error => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.error(`${item} 삭제 오류:`, error);
                });
        };

        const handleRecommend = (type, id) => {
            const url = type === 'post' ? `http://localhost:8000//board/xfilter/vote/${id}/` : `http://localhost:8000/board/comment/vote/${id}/`;

            axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.log(`${item} 추천 응답:`, response);
                })
                .catch(error => {
                    const item = type === 'post' ? '게시물' : '댓글';
                    console.error(`${item} 추천 오류:`, error);
                });
        };

        return (
            <div className="container my-3" style={{ backgroundColor: 'white' }}>
                <div className="top section">
                    <form onSubmit={handlePostSubmit}>
                        <div>
                            <label htmlFor="content" className="form-label">게시글</label>
                            <textarea className="form-control" name="content" id="content" rows={10}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary my-2">게시하기</button>
                        <button onClick={() => handleRecommend('post', postId)} className="btn btn-outline-success mx-2">
                            추천하기
                        </button>
                    </form>

                    <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit('post', postId)} className="btn btn-outline-secondary mx-2">
                            수정
                        </button>
                        <button onClick={() => handleDelete('post', postId)} className="btn btn-outline-danger">
                            삭제
                        </button>
                    </div>
                </div>

                <div className="bottom-section">
                    <form onSubmit={handleCommentSubmit}>
                        <div>
                            <label htmlFor="content" className="form-label">label</label>
                            <textarea className="form-control" name="content" id="content" rows={10}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary my-2">댓글달기</button>
                        <button onClick={() => handleRecommend('comment', commentId)} className="btn btn-outline-success mx-2">
                            추천하기
                        </button>
                    </form>

                    <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit('comment', commentId)} className="btn btn-outline-secondary mx-2">
                            수정
                        </button>
                        <button onClick={() => handleDelete('comment', commentId)} className="btn btn-outline-danger">
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    export default Detail;
