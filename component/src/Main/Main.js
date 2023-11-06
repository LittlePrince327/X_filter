import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.module.css';

const Main = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://your-django-backend-url/data', {
        params: { page: page, keyword: keyword }
      });
      setData(response.data);
    } catch (error) {
      // 에러 처리
      console.error('Error fetching data: ', error);
    }
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = () => {
    setPage(1);
    // fetchData 함수를 호출하여 검색 액션을 수행합니다.
    fetchData();
  };

  useEffect(() => {
    // 페이지 또는 키워드가 변경되면 fetchData 함수를 호출하여 데이터를 가져옵니다.
    fetchData();
  }, [page, keyword]);

  return (
    <div className="container my-3">
      {/* ... 기타 HTML 컨텐츠 ... */}
      <div className="input-group">
        <input
          type="text"
          id="search_kw"
          className="form-control"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
            찾기
          </button>
        </div>
      </div>
      {/* ... 기타 HTML 컨텐츠 ... */}
      <ul className="pagination justify-content-center">
        {/* ... 페이징 컨텐츠 ... */}
      </ul>
      {/* ... 기타 HTML 컨텐츠 ... */}
    </div>
  );
};

export default Main;
