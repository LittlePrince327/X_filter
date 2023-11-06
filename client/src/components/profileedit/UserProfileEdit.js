import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfileEdit() {
  const { userId } = useParams();
  const [user_id, setUser_id] = useState(null);
  const [userData, setUserData] = useState({});
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/get-user-id/")
      .then((response) => {
        const retrievedUserId = response.data.user_id;
        setUser_id(retrievedUserId);
        console.log("User ID:", retrievedUserId);
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
    axios
      .put(`/api/user-profile/${user_id}/`, updatedUserData)
      .then((response) => {
        setUserData(response.data);

        // 프로필 업데이트가 성공한 경우
        setUpdateSuccess(true);
        setUpdateMessage("Profile updated successfully");
      })
      .catch((error) => {
        console.error(error);

        // 프로필 업데이트가 실패한 경우
        setUpdateSuccess(false);
        setUpdateMessage("Failed to update profile");
      });
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

      {updateSuccess && <div className="success-message">{updateMessage}</div>}
      {!updateSuccess && updateMessage && (
        <div className="error-message">{updateMessage}</div>
      )}
    </div>
  );
}

export default UserProfileEdit;
