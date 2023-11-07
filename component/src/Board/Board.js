import React from 'react';
import styles from './Board.module.css'; // Your CSS module for styling

const Board = () => {
    // Emulating data similar to what's rendered in the HTML code
    const xfilter_list = [
        {
            id: 1,
            subject: 'Sample Post 1',
            comment_set: { count: 3 },
            author: { username: 'User1' },
            create_date: '2023-11-07'
        },
        {
            id: 2,
            subject: 'Sample Post 2',
            comment_set: { count: 0 },
            author: { username: 'User2' },
            create_date: '2023-11-05'
        }
        // Add more data as needed
    ];

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className="col-6">
                    <button className={`${styles.customBtn} btn btn-primary`}>게시글 작성하기</button>
                </div>
                <div className="col-6">
                    <div className={styles.searchContainer}>
                        <input type="text" className={`${styles.searchInput} form-control`} placeholder="Search" />
                        <button className={`${styles.searchBtn} btn btn-outline-secondary`} type="button">
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
                    {xfilter_list.map((xfilter, index) => (
                        <tr className="text-center" key={xfilter.id}>
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
            <ul className={`pagination justify-content-center ${styles.pagination}`}>
                {/* Pagination elements go here */}
            </ul>
        </div>
    );
};

export default Board;
