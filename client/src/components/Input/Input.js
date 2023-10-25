import React, { useState } from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, uploadFile }) => {
  const [fileInput, setFileInput] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Pass the selected file to the parent component
      uploadFile(file);
    }
  };

  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message ..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
      />
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={(input) => setFileInput(input)} // Use ref to reference the file input element
      />
      <button className="sendButton" onClick={(event) => sendMessage(event)}>
        Enter
      </button>
      <button
        className="uploadButton"
        onClick={() => fileInput.click()} // When the button is clicked, trigger the file input click event
      >
        Upload File
      </button>
    </form>
  );
};

export default Input;
