import React, { useState, useEffect } from 'react';
import styles from './Detail.module.css';
import {
    get_user_info,
    postBoard, 
    postComment,
    editBoard, 
    deleteBoard, 
    recommendBoard,
    editComment,
    deleteComment,
    recommendComment
} from '../api';

const Detail = () => {
    const postId = 123;
    const commentId = 456;
    const [userToken, setUserToken] = useState('');
    const [userData, setUserData] = useState(null);


    // 토큰 받아서 local storage에 저장
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');

        const fetchData = async () => {
            if (tokenFromStorage) {
                setUserToken(tokenFromStorage);
                try {
                    const response = await get_user_info(tokenFromStorage);
                    if (response.full_name) {
                        localStorage.setItem('full_name', response.full_name);
                    }
                    setUserData(response);
                } catch (error) {
                    console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
                }
            }
        };
        fetchData();
    }, [setUserToken, setUserData]);


    // 게시글 작성
    const handlepostBoard = async (event) => {
        event.preventDefault();
        const content = event.target.content.value;
        const author = localStorage.getItem('full_name');
        const create_date = new Date().toISOString();

        try {
            const response = await postBoard(content, author, create_date, userToken);
            console.log(response);
        } catch (error) {
            console.error('게시물 제출 오류:', error);
        }

    }

    // 게시글 수정
    const handleeditBoard = async (event) => {
        event.preventDefault();
        try {
            const updatedContent = event.target.content.value;
            const response = await editBoard(postId, updatedContent);
            console.log(response);
        } catch (error) {
            console.error('게시글 수정 오류:', error);
        }
    };

    // 게시글 삭제
    const handledeleteBoard = async () => {
        try {
            const response = await deleteBoard(postId);
            console.log(response);
        } catch (error) {
            console.error('게시글 삭제 오류:', error);
        }
    };

    // 게시글 추천
    const handlerecommendBoard = async () => {
        const type = 'post';
        try {
            const response = await recommendBoard(type, postId);
            console.log(response);
        } catch (error) {
            console.error('게시글 추천 오류:', error);
        }
    };

    // 댓글 작성
    const handlepostComment = async (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        try {
            const response = await postComment(content, postId);
            console.log(response);
        }
        catch (error) {
            console.error('댓글 제출 오류:', error);
        }
    }

    // 댓글 수정
    const handleeditComment = async (event) => {
        event.preventDefault();
        const updatedContent = event.target.content.value;
        try {
            const response = await editComment(commentId, updatedContent);
            console.log(response);
        } catch (error) {
            console.error('댓글 수정 오류:', error);
        }
    };

    // 댓글 삭제
    const handledeleteComment = async (commentId) => {
        try {
            const response = await deleteComment(commentId);
            console.log(response);
        } catch (error) {
            console.error('댓글 삭제 오류:', error);
        }
    };

    // 댓글 추천
    const handlerecommendComment = async (commentId) => {
        try {
            const response = await recommendComment(commentId);
            console.log(response);
        } catch (error) {
            console.error('댓글 추천 오류:', error);
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
                <button onClick={handlerecommendBoard} className="btn btn-outline-success mx-2">
                    추천하기
                </button>

                <div className={styles.actionButtons}>
                    <button onClick={handleeditBoard} className="btn btn-outline-secondary mx-2">
                        수정
                    </button>
                    <button onClick={handledeleteBoard} className="btn btn-outline-danger">
                        삭제
                    </button>
                </div>
            </div>

            <div className="bottom-section">
                <form onSubmit={handlepostComment}>
                    <div>
                        <label htmlFor="content" className="form-label">댓글</label>
                        <textarea className="form-control" name="content" id="content" rows={10}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary my-2">댓글달기</button>
                </form>
                <button onClick={handlerecommendComment} className="btn btn-outline-success mx-2">
                    추천하기
                </button>

                <div className={styles.actionButtons}>
                    <button onClick={handleeditComment} className="btn btn-outline-secondary mx-2">
                        수정
                    </button>
                    <button onClick={() => handledeleteComment(commentId)} className="btn btn-outline-danger">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Detail;
