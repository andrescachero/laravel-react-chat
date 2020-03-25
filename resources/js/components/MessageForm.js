import React, { useState, useEffect } from "react";

const MessageForm = ({ addMessage }) => {
    const [message, setMessage] = useState("");
    const handleSubmit = ev => {
        ev.preventDefault();
        if (message.length == 0) {
            return;
        }
        const time = new Date();
        const timestamp = `${time.getHours()}:${time.getMinutes()}`;
        addMessage(message, "you", timestamp, "success");
        axios
            .post("/send", {
                message: message,
                timestamp: timestamp
            })
            .then(function(response) {})
            .catch(function(error) {
                console.log(error);
            });
        setMessage("");
    };

    useEffect(() => {
        window.Echo.private("chat").whisper("typing", {
            message: message
        });
    }, [message]);

    return (
        <form onSubmit={handleSubmit} className="w-100">
            <input
                type="text"
                className="form-control w-100"
                placeholder="Type your message here..."
                onChange={ev => setMessage(ev.target.value)}
                value={message}
            />
        </form>
    );
};

export default MessageForm;
