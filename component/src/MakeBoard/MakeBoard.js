import React, { useState, useEffect } from 'react';
import styles from './MakeBoard.module.css';
import {
    get_user_info,
    postBoard, 
} from '../api';

const MakeBoard = () => {
    const postId = 123;
    const commentId = 456;
    const [userToken, setUserToken] = useState('');
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
    
        const fetchData = async () => {
            if (tokenFromStorage) {
                try {
                    const response = await get_user_info(tokenFromStorage);
                    if (response.full_name) {
                        // 사용자의 토큰과 전체 이름이 정확한지 확인합니다.
                        localStorage.setItem('author', response.full_name);
                    }
                    setUserToken(tokenFromStorage);
                    // 사용자 토큰을 로컬 저장소에 설정합니다.
                    localStorage.setItem('token', tokenFromStorage);
                    setUserData(response);
                    // 전체 이름을 로컬 저장소에 설정합니다.
                    localStorage.setItem('author', response.full_name);
                } catch (error) {
                    console.error('사용자 정보 가져오는 중 오류:', error);
                }
            }
        };
        fetchData();
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
        } catch (error) {
            console.error('게시물 제출 오류:', error);
        }

    }


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
}

export default MakeBoard;
