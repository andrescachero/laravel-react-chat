import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import MessageForm from "./MessageForm";
import Message from "./Message";

toast.configure();

const ChatApp = function() {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [users, setUsers] = useState([]);

    const addMessage = (message, username, timestamp, color) => {
        setMessages(messages => [
            ...messages,
            {
                id: messages.length,
                text: message,
                username: username,
                color: color,
                timestamp: timestamp
            }
        ]);
    };
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        $(".toast").toast();
        window.Echo.private("chat")
            .listen("ChatEvent", e => {
                addMessage(e.message, e.user.name, e.timestamp, "warning");
            })
            .listenForWhisper("typing", e => {
                const isTyping = e.message.length != 0;
                setTyping(isTyping);
            });
        window.Echo.join("chat")
            .here(users => {
                setUsers(users);
            })
            .joining(user => {
                setUsers(users => [...users, user]);
                toast(`${user.name} entered the room`);
            })
            .leaving(user => {
                setUsers(users => users.filter(u => u.name != user.name));
                toast(`${user.name} left the room`);
            });
    }, []);

    return (
        <div className="container">
            <div className="row offset-3 col-6">
                <div className="list-group-item active m-0 w-100 d-inline">
                    <h1 className="d-inline">Chat Room</h1>
                    <div className="badge badge-pill badge-dark ml-1">
                        {users.length}
                    </div>
                </div>
                {typing ? (
                    <div className="badge badge-pill badge-primary mt-1">
                        typing...
                    </div>
                ) : (
                    ""
                )}
                <ul
                    className="list-group w-100"
                    style={{ height: 300, overflowY: "auto" }}
                >
                    {messages.map((msg, index) => (
                        <Message
                            key={index}
                            message={msg.text}
                            username={msg.username}
                            color={msg.color}
                            timestamp={msg.timestamp}
                        />
                    ))}
                    <li
                        key={messages.length + 2}
                        ref={messagesEndRef}
                        style={{ height: 0 }}
                    ></li>
                </ul>

                <MessageForm addMessage={addMessage} />
            </div>
        </div>
    );
};

ReactDOM.render(<ChatApp />, document.getElementById("chat-app"));
