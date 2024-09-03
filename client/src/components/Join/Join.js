import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [room, setRoom] = useState('');
    const local_nickname = localStorage.getItem('usernickname');
    
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer bg-dark">
                <h1 className="heading">Join as, { local_nickname }</h1>
                <div>
                    <input placeholder="Room Name" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
                </div>
                <Link onClick={event => (!local_nickname || !room) ? event.preventDefault(): null} to={`/chat?name=${local_nickname}&room=${room}`}>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}
export default Join;