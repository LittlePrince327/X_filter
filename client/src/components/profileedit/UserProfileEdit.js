import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfileEdit() {
  const { userId } = useParams(); // URL에서 userId를 가져옴
  const [user_id, setUser_id] = useState(null); // 초기화

  const [userData, setUserData] = useState({});
  const [updatedUserData, setUpdatedUserData] = useState({});

  useEffect(() => {
    // User ID retrieval
    axios
      .get("/api/get-user-id/")
      .then((response) => {
        const retrievedUserId = response.data.user_id;
        setUser_id(retrievedUserId); // user_id를 설정
        console.log("User ID:", retrievedUserId); // 사용자 ID를 콘솔에 출력
        if (retrievedUserId) {
          return axios.get(`/api/user-profile/${retrievedUserId}/`);
        }
      })
      .then((response) => {
        setUserData(response.data);
        setUpdatedUserData(response.data);
      })
      .catch((error) => console.error(error));
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleFormSubmit = () => {
    // Profile update API request using user_id
    axios
      .put(`/api/user-profile/${user_id}/`, updatedUserData)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>User Profile Edit</h1>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={updatedUserData.username}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={updatedUserData.email}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleFormSubmit}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default UserProfileEdit;
