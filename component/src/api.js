import axios from 'axios';

const BASE_URL = 'http://localhost:8000/';

async function get_user_info(full_name, userToken) {
  const body = {
    full_name: full_name
  };
  const headerOption = {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  };

  const response = await axios.post(`${BASE_URL}/api/get-user-info`, body, headerOption);
  const data = response.data;
  return data;
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

async function postComment(content, postId, userToken){
  const body = {
    content: content,
    postId: postId
  };
  const headerOption = {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  };

  const response = await axios.post(`${BASE_URL}/comment/create/<int:xfilter_id>/`, body, headerOption);
  const data = await response.data;
  return data;
};

async function editBoard(postId, updatedContent, userToken) {
  try {
    const body = {
      postId: postId,
      content: updatedContent
    };
    const headerOption = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    const response = await axios.put(`${BASE_URL}/xfilter/modify/<int:xfilter_id>/`, body, headerOption);
    const data = response.data;
    return data;
  } catch (error) {
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

async function editComment(commentId, updatedContent, userToken) {
  try {
    const body = {
      commentId: commentId,
      content: updatedContent
    };
    const headerOption = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    const response = await axios.put(`${BASE_URL}/comment/modify/<int:comment_id>/`, body, headerOption);
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
  editBoard, 
  deleteBoard, 
  recommendBoard,
  editComment,
  deleteComment,
  recommendComment
};
