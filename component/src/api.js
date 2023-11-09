import axios from 'axios';

const BASE_URL = 'http://localhost:8000/';

async function get_user_info(userToken) {
  const headerOption = {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  };
  try {
    const response = await axios.get(`${BASE_URL}/api/get_user_info/`, headerOption);
    const userData = response.data;
    return userData;
  } catch (error) {
    console.error('사용자 정보 가져오는 중 오류:', error);
    throw error; // 오류 처리나 예외 처리를 위해 오류를 다시 throw하는 것이 유용합니다.
  }
}

async function postBoard(content, author, create_date, userToken) {
  const body = {
    content: content,
    author: author,
    create_date: create_date
  };
  const headerOption = {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  };

  const response = await axios.post(`${BASE_URL}/board/xfilter/create`, body, headerOption);
  const data = response.data;
  return data;
}

async function postComment(content, author, create_date, xfilter_id, userToken) {
  try {
    const body = {
      content: content,
      author: author,
      create_date: create_date,
      xfilter_id: xfilter_id
    };

    const headerOption = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await axios.post(`${BASE_URL}board/comment/create/${xfilter_id}/`, body, headerOption);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error; 
  }
}


async function deleteBoard(postId, userToken) {
  try {
    const body = {
      postId: postId
    }
    const headerOption = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    const response = await axios.delete(`${BASE_URL}/xfilter/delete/<int:xfilter_id>/`, headerOption);
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
}

async function recommendBoard(type, id, userToken) {
  try {
    const response = await axios.post(`${BASE_URL}/xfilter/vote/<int:xfilter_id>/`);
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
}

async function deleteComment(commentId, userToken) {
  try {
    const body = {
      commentId: commentId
    };
    const headerOption = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    const response = await axios.delete(`${BASE_URL}/comment/delete/<int:comment_id>/`, headerOption);
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
}

async function recommendComment(commentId, userToken) {
  try {
    const response = await axios.post(`${BASE_URL}/comment/vote/<int:comment_id>/`);
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
}



export { 
  get_user_info,
  postBoard, 
  postComment, 
  deleteBoard, 
  recommendBoard,
  deleteComment,
  recommendComment
};
