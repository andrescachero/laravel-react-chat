import React from "react";

const Message = ({ message, username, color, timestamp }) => {
    return (
        <li className={`list-group-item list-group-item-${color} p-2`}>
            <div className="d-block">
                <span className={`badge badge-${color}`}>{username}</span>
            </div>
            <div className="d-flex w-100 justify-content-between">
                {message}
            </div>
            <div className="d-flex flex-row-reverse">
                <small>{timestamp}</small>
            </div>
        </li>
    );
};

export default Message;
