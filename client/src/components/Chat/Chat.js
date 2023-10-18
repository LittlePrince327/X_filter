import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import './Chat.css'
import TextContainer from "../TextContainer/TextContainer";

const ENDPOINT = 'http://localhost:5000'

let socket

const Chat = ({ location }) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // 여기에서 URL 쿼리 파라미터에서 'name'과 'room'을 가져옵니다.
    const { name, room } = queryString.parse(window.location.search)

    console.log(name, room)

    // 서버와의 소켓 연결을 설정합니다.
    socket = io(ENDPOINT)

    // 'room'과 'name' 상태를 설정합니다.
    setRoom(room)
    setName(name)

    // 사용자가 채팅방에 참가하도록 서버에 'join' 이벤트를 전송합니다.
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error)
      }
    })
  }, []); // 빈 배열을 사용하여 종속성을 제거

  useEffect(() => {
    // 새 메시지 이벤트를 수신하고, 메시지를 메시지 상태에 추가합니다.
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message])
    })

    // 채팅방 사용자 목록을 업데이트합니다.
    socket.on('roomData', ({ users }) => {
      setUsers(users)
    })
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat