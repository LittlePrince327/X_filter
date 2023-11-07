import React, { useState, useEffect } from 'react';
import styles from './Detail.module.css';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const Detail = () => {
    const postId = 123; // 실제 게시물 ID로 대체
    const commentId = 456; // 실제 댓글 ID로 대체
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
                    localStorage.setItem('full_name', response.data.full_name); // Storing full_name in local storage
                }
    
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };
    
        if (tokenFromStorage) {
            setUserToken(tokenFromStorage);
            fetchUserInfo();
        }
    }, []);

    const handlePostSubmit = (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        axios.post(`http://localhost:8000/board/xfilter/create/`, { content }, {
            headers: {
                Authorization: `Bearer ${userToken}`, // userToken은 유저의 인증 토큰
            },
        })
            .then(response => {
                console.log('게시글이 성공적으로 생성되었습니다.', response);
                // 추가적인 상태 업데이트 또는 사용자 경험 변경
            })
            .catch(error => {
                console.error('게시글 생성 중 오류가 발생했습니다.', error);
            });
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        axios.post(`${BASE_URL}/board/comment/create/${postId}/`, { content }, {
            headers: {
                Authorization: `Bearer ${userToken}`, // userToken은 유저의 인증 토큰
            },
        })
            .then(response => {
                console.log('댓글이 성공적으로 생성되었습니다.', response);
                // 추가적인 상태 업데이트 또는 사용자 경험 변경
            })
            .catch(error => {
                console.error('댓글 생성 중 오류가 발생했습니다.', error);
            });
    };

    const handleEdit = (type, id) => {
        const url = type === 'post' ? `${BASE_URL}/board/xfilter/modify/${id}/` : `${BASE_URL}/board/comment/modify/${id}/`;

        axios.post(url, null, {
            headers: {
                Authorization: `Bearer ${userToken}`, // userToken은 유저의 인증 토큰
            },
        })
            .then(response => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.log(`${item}이 성공적으로 수정되었습니다.`, response);
            })
            .catch(error => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.error(`${item} 수정 중 오류가 발생했습니다.`, error);
            });
    };

    const handleDelete = (type, id) => {
        const url = type === 'post' ? `${BASE_URL}/board/xfilter/delete/${id}/` : `${BASE_URL}/board/comment/delete/${id}/`;

        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${userToken}`, // userToken은 유저의 인증 토큰
            },
        })
            .then(response => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.log(`${item}이 성공적으로 삭제되었습니다.`, response);
            })
            .catch(error => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.error(`${item} 삭제 중 오류가 발생했습니다.`, error);
            });
    };

    const handleRecommend = (type, id) => {
        const url = type === 'post' ? `${BASE_URL}/board/xfilter/vote/${id}/` : `${BASE_URL}/board/comment/vote/${id}/`;

        axios.post(url, null, {
            headers: {
                Authorization: `Bearer ${userToken}`, // userToken은 유저의 인증 토큰
            },
        })
            .then(response => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.log(`${item}이 성공적으로 추천되었습니다.`, response);
            })
            .catch(error => {
                const item = type === 'post' ? '게시물' : '댓글';
                console.error(`${item} 추천 중 오류가 발생했습니다.`, error);
            });
    };

    return (
        <div className="container my-3" style={{ backgroundColor: 'white' }}>
            <div className="top-section">
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
                        <label htmlFor="content" className="form-label">답변</label>
                        <textarea className="form-control" name="content" id="content" rows={10}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary my-2">답변하기</button>
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
