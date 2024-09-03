import React from 'react';

import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => (
    <div className="form wrap-input100-snd validate-input" data-validate="Message">
        <input 
            className="input100-snd" 
            type="text" 
            placeholder="Type a message..."
            value={message}
            onChange={ (event) => setMessage(event.target.value) }
            onKeyPress={ event => event.key === 'Enter' ? sendMessage(event) : null }
        />
        <button className="sendButton" onClick={ (event) => sendMessage(event) }>Send</button>
    </div>
)

export default Input;