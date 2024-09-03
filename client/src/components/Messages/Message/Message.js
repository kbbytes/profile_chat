import React from 'react';
import Avatar, { ConfigProvider } from 'react-avatar';
//import jwt_decode from 'jwt-decode';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user, send_time, first_name, last_name, avatar, userid }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }
  //const token = localStorage.usertoken;
  //const decoded = jwt_decode(token);

  return (
    
    isSentByCurrentUser
      ? (
        <ConfigProvider colors={['red', 'green', 'blue']}>
          <div className="messageContainer justifyEnd">
            <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
              <div className="message-time">{send_time}</div>
            </div>
          </div>
        </ConfigProvider>
        )
        : (
          <div className="messageContainer justifyStart">
            {first_name === undefined ? null :
              <div className="message-avatar"><Avatar size="50" round={true} name={ first_name + ' ' + last_name} src={`/uploads/avatars/${avatar}`} /></div>
            }
            <div className="messageBox backgroundLight">
              {user !== 'admin' ? <p className="sentText pr-10 colorDark">{user}</p> : null}      
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
              <div className="message-time colorDark">{send_time}</div>
            </div>
          </div>
        )
  );
}

export default Message;