import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileEdit() {
  const [formData, setFormData] = useState({});
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/profile/").then((response) => {
      setProfile(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    axios
      .put("/api/profile/", formData)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <input
          type="text"
          name="bio"
          placeholder="Bio"
          value={formData.bio || profile.bio || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL"
          value={formData.avatar || profile.avatar || ""}
          onChange={handleChange}
        />
        <button type="button" onClick={handleSubmit}>
          Save
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ProfileEdit;
