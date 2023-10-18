import React, {useEffect} from 'react';

import ScrollToBottom from "react-scroll-to-bottom";
import Message from '../Message/Message';

function Messages({ messages, name }) {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => {
        return <div key={i}><Message message={message} name={name} /></div>
      })}
    </ScrollToBottom>
  );
}

export default Messages;