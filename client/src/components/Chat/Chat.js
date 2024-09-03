import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import jwt_decode from 'jwt-decode';

import './Chat.css';

let socket;

const Chat = ({ location }) => {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    var decoded = 0;
    const token = localStorage.usertoken;
    if(token)
      decoded = jwt_decode(token);
    const user_id = decoded.id;

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);
    
    socket.emit('join', { name, room, user_id }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const token = localStorage.usertoken;
    var decoded = 0;
    if(token)
      decoded = jwt_decode(token);
    if(message) {
      var send_pm_data = {
        message: message,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        nickname: decoded.nickname,
        userid: decoded.id,
        userrank: decoded.rank,
        avatar: decoded.avatar
      }
      socket.emit('sendMessage', send_pm_data, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container bg-chat">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
