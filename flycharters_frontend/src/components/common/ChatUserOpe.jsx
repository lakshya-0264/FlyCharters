import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMessages } from "../../api/authAPI";
import { BsChatQuote } from "react-icons/bs";
import { useLocation } from "react-router-dom";

// Import chat icon

function ChatUserOpe() {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { userId, userName } = location.state || {};
    const operatorId = localStorage.getItem("id");
    console.log('user id:',userId);
    console.log(userName);
    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach(msg => {
            const date = new Date(msg.timestamp).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return grouped;
    };

    const groupedMessages = groupMessagesByDate(messages);

    // Format date header (Today, Yesterday, or date)
    const formatDateHeader = (dateString) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const messageDate = new Date(dateString);
        
        if (messageDate.toLocaleDateString() === today.toLocaleDateString()) {
            return "Today";
        } else if (messageDate.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    // Fetch existing messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessages({
                    user1: operatorId,
                    user2: userId
                });
                setMessages(response.data);
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError("Failed to load messages");
            } finally {
                setLoading(false);
            }
        };

        if (operatorId && userId) {
            fetchMessages();
        }
    }, [operatorId, userId]);

    // Socket connection
    useEffect(() => {
        if (!operatorId || !userId) return;

        const newSocket = io("http://localhost:8080", {
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
            console.log("Socket connected, joining rooms...");
            newSocket.emit("join", operatorId);
            newSocket.emit("join", userId);
        });

        newSocket.on("chat-message", (data) => {
            console.log("chat-message received", data);
            if ((data.fromUserId === userId && data.toUserId === operatorId) || 
                (data.fromUserId === operatorId && data.toUserId === userId)) {
                setMessages(prev => {
                    const exists = prev.some(msg => msg._id === data._id);
                    return exists ? prev : [...prev, data];
                });
            }
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            setError("Connection error - trying to reconnect...");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [operatorId, userId]);

    useEffect(() => {
        const chatContainer = document.querySelector(".chat-scroll");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket) return;

        const msg = {
            message: input,
            fromUserId: operatorId,
            toUserId: userId
        };

        socket.emit("chat-message", msg);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    if (loading) {
        return <div className="loading-messages">Loading messages...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <><div className="chat-header">
                <h2>Chat with {userName}</h2>
            </div>
            <div className="chat-container">
            <div className="chat-scroll">
                {messages.length === 0 ? (
                    <div className="empty-state-message">
                        <BsChatQuote style={{ fontSize: "80px", color: "#E6E6E6", marginBottom: "16px" }} />
                        <p><strong>No messages yet</strong></p>
                        <p>Start the conversation by sending your first message</p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date} className="date-group">
                            <div className="date-header">{formatDateHeader(date)}</div>
                            {dateMessages.map((msg) => (
                                <div 
                                    key={msg._id} 
                                    className={`message-wrapper ${msg.fromUserId === operatorId ? 'sent' : 'received'}`}
                                >
                                    <div className="message-bubble">
                                        {msg.message}
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!socket || !socket.connected}
                />
                <button
                    onClick={sendMessage}
                    disabled={!socket || !socket.connected || !input.trim()}
                >
                    Send
                </button>
            </div>

            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 70vh;
                    width: 100%;
                    margin: auto;
                    background-color: white;
                    overflow: hidden;
                }

                .chat-header {
                    padding: 30px;
                    background-color: #061953;
                    color: white;
                    text-align: center;
                    position: relative;
                }

                .chat-header h2 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 500;
                }

                .chat-scroll {
                    flex: 1;
                    padding: 16px 5%;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .empty-state-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: #666;
                    padding: 20px;
                }

                .empty-state-message p {
                    margin:  0;
                }

                .empty-state-message p:first-of-type {
                    font-size: 20px;
                    font-weight:300;
                    letter-spacing:2px;
                    text-transform: uppercase;
                    color: #333;
                }

                .empty-state-message p:last-of-type {
                    font-size: 17px;
                    color: #999;
                }

                .date-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .date-header {
                    text-align: center;
                    margin: 12px 0;
                    font-size: 12px;
                    color: #666;
                    position: relative;
                }

                .date-header:before,
                .date-header:after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    width: 30%;
                    height: 1px;
                    background-color: #ddd;
                }

                .date-header:before {
                    left: 0;
                }

                .date-header:after {
                    right: 0;
                }

                .message-wrapper {
                    display: flex;
                    flex-direction: column;
                }

                .message-wrapper.sent {
                    align-items: flex-end;
                }

                .message-wrapper.received {
                    align-items: flex-start;
                }

                .message-bubble {
                    max-width: 70%;
                    padding: 10px 14px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    position: relative;
                    word-wrap: break-word;
                }

                .message-wrapper.sent .message-bubble {
                    background-color: #061953;
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .message-wrapper.received .message-bubble {
                    background-color: white;
                    color: #333;
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
                }

                .message-time {
                    display: block;
                    font-size: 11px;
                    opacity: 0.8;
                    margin-top: 4px;
                    text-align: right;
                }

                .message-wrapper.received .message-time {
                    color: #666;
                }

                .message-wrapper.sent .message-time {
                    color: rgba(255, 255, 255, 0.8);
                }

                .input-area {
                    padding: 12px 20%;
                    background-color: white;
                    display: flex;
                    gap: 8px;
                    border-top: 1px solid #061953;
                }

                .input-area input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #ddd;
                    border-radius: 24px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .input-area input:focus {
                    border-color: #061953;
                }

                .input-area button {
                    padding: 0 20px;
                    background-color: #061953;
                    color: white;
                    border: none;
                    border-radius: 24px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                    opacity: 1;
                }

                .input-area button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .input-area button:not(:disabled):hover {
                    background-color: #0a2463;
                }

                .loading-messages {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .error-message {
                    color: #d32f2f;
                    text-align: center;
                    padding: 20px;
                    background-color: #ffebee;
                    border-radius: 4px;
                    margin: 20px;
                }
            `}</style>
        </div></>
        
    );
}

export default ChatUserOpe;