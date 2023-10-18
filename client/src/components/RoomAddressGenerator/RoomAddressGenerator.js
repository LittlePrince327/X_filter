import React from 'react';

function RoomAddressGenerator({ onGenerate }) {
  // Function to generate a random room address
  const generateRandomRoomAddress = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const handleGenerate = () => {
    // Generate a random room address of length 8 (you can adjust the length as needed)
    const randomRoomAddress = generateRandomRoomAddress(8);
    onGenerate(randomRoomAddress);
  }

  return (
    <div>
      <button onClick={handleGenerate}>무작위 방 주소 생성</button>
    </div>
  );
}

export default RoomAddressGenerator;
