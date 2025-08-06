import React, { useState, useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import { getChats } from "../../api/authAPI"; 
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import loadingGif from "../../assets/LoadingGIF.gif";

const ChatIcon = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const wrapperRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!userId) return;
        const newSocket = io("http://localhost:8080", { withCredentials: true });
        newSocket.emit("join", userId);
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [userId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("chat-message", (newMessage) => {
            setChats(prev => {
                const updated = [...prev];
                const chatIndex = updated.findIndex(chat => chat._id === newMessage.chatId);
                if (chatIndex !== -1) {
                    updated.splice(chatIndex, 1);
                }
                return [{ ...newMessage, unread: true }, ...updated];
            });
            setUnreadCount(prev => prev + 1);
        });

        return () => socket.off("chat-message");
    }, [socket]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const res = await getChats();
            const sorted = res.data.data.sort((a, b) =>
                new Date(b.updatedAt || b.messages?.[0]?.timestamp) -
                new Date(a.updatedAt || a.messages?.[0]?.timestamp)
            );

            const unread = sorted.reduce((acc, chat) => {
                const lastMsg = chat.messages.at(-1);
                return lastMsg?.sender !== userId ? acc + 1 : acc;
            }, 0);

            setChats(sorted);
            setUnreadCount(unread);
        } catch (err) {
            console.error("Error fetching chats:", err);
        } finally {
            setLoading(false);
        }
    };

    const togglePanel = () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);
        if (willOpen) {
            fetchChats();
        }
    };

    const closePanel = () => {
        setIsOpen(false);
        setCurrentChat(null);
        setUnreadCount(0);
    };

    const handleChatClick = (chat) => {
        setCurrentChat(chat);
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !socket || !currentChat) return;

        const msg = {
            message: messageInput,
            chatId: currentChat._id,
            fromUserId: userId,
            toUserId: currentChat.participants.find(id => id !== userId)
        };

        socket.emit("chat-message", msg);
        
        // Optimistic update
        const updatedChat = {
            ...currentChat,
            messages: [
                ...currentChat.messages,
                {
                    message: messageInput,
                    sender: userId,
                    timestamp: new Date().toISOString()
                }
            ]
        };
        
        setCurrentChat(updatedChat);
        setMessageInput("");
        
        // Update the chat list
        setChats(prev => {
            const otherChats = prev.filter(chat => chat._id !== currentChat._id);
            return [updatedChat, ...otherChats];
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                closePanel();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChat?.messages]);

    return (
        <div className="chat-wrapper" ref={wrapperRef}>
            <div className="chat-icon-container" onClick={togglePanel}>
                <div className="chat-icon">
                    <MessageCircle className="chat-icon-svg" />
                    <span>Chat With Us</span>
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="chat-overlay" onClick={closePanel}></div>
                    <div className="chat-popup">
                        {currentChat ? (
                            <div className="chat-conversation">
                                <div className="chat-header">
                                    <button 
                                        className="back-button"
                                        onClick={() => setCurrentChat(null)}
                                    >
                                        &larr;
                                    </button>
                                    <h4>Chat with {currentChat.participants.find(id => id !== userId)}</h4>
                                    <IoClose 
                                        className="close-icon" 
                                        onClick={closePanel} 
                                    />
                                </div>
                                
                                <div className="messages-container">
                                    {currentChat.messages.map((msg, i) => (
                                        <div 
                                            key={i}
                                            className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
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
                                    <div ref={messagesEndRef} />
                                </div>
                                
                                <div className="message-input">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                    />
                                    <button onClick={sendMessage}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <h4>Chats</h4>
                                    <div className="header-actions">
                                        <LuRefreshCw
                                            className={`refresh-icon ${loading ? "spin" : ""}`}
                                            onClick={fetchChats}
                                        />
                                        <IoClose className="close-icon" onClick={closePanel} />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="loading-state">
                                        <img src={loadingGif} alt="Loading..." />
                                    </div>
                                ) : chats.length === 0 ? (
                                    <div className="empty-state">
                                        <p><strong>No chats yet.</strong></p>
                                        <p>Start a conversation with Admin.</p>
                                    </div>
                                ) : (
                                    <ul className="chat-list">
                                        {chats.map((chat, i) => {
                                            const lastMessage = chat.messages?.[chat.messages.length - 1];
                                            return (
                                                <li
                                                    key={i}
                                                    className={`chat-item ${lastMessage?.sender !== userId ? 'unread' : ''}`}
                                                    onClick={() => handleChatClick(chat)}
                                                >
                                                    <div className="chat-item-header">
                                                        <strong>Chat with {chat.participants.find(id => id !== userId)}</strong>
                                                        <span className="chat-time">
                                                            {new Date(lastMessage?.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="chat-preview">{lastMessage?.message}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                .chat-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 1000;
                }

                .chat-icon-container {
                    cursor: pointer;
                }

                .chat-icon {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 20px;
                    background-color: #061953;
                    color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    position: relative;
                    transition: all 0.2s ease;
                }

                .chat-icon:hover {
                    background-color: #0a2463;
                    transform: translateY(-2px);
                }

                .chat-icon-svg {
                    height: 20px;
                    width: 20px;
                }

                .notification-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }

                .chat-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }

                .chat-popup {
                    position: fixed;
                    bottom: 90px;
                    right: 30px;
                    width: 350px;
                    max-height: 500px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 1000;
                }

                .chat-header {
                    padding: 16px;
                    background-color: #061953;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius:10px;
                }

                .chat-header h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 500;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .close-icon, .refresh-icon {
                    cursor: pointer;
                    font-size: 18px;
                    transition: transform 0.2s;
                }

                .close-icon:hover, .refresh-icon:hover {
                    transform: scale(1.1);
                }

                .refresh-icon.spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .loading-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .loading-state img {
                    width: 40px;
                    height: 40px;
                }

                .empty-state {
                    padding: 20px;
                    text-align: center;
                    color: #666;
                }

                .empty-state p {
                    margin: 4px 0;
                }

                .chat-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    overflow-y: auto;
                    flex: 1;
                }

                .chat-item {
                    padding: 12px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .chat-item:hover {
                    background-color: #f8f8f8;
                }

                .chat-item.unread {
                    background-color: #f0f9ff;
                }

                .chat-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }

                .chat-item-header strong {
                    font-size: 14px;
                }

                .chat-time {
                    font-size: 12px;
                    color: #666;
                }

                .chat-preview {
                    margin: 0;
                    font-size: 13px;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* Conversation view styles */
                .chat-conversation {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .messages-container {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background-color: #f9f9f9;
                }

                .message {
                    margin-bottom: 12px;
                    display: flex;
                }

                .message.sent {
                    justify-content: flex-end;
                }

                .message.received {
                    justify-content: flex-start;
                }

                .message-content {
                    max-width: 80%;
                    padding: 8px 12px;
                    border-radius: 12px;
                    position: relative;
                    word-wrap: break-word;
                }

                .message.sent .message-content {
                    background-color: #061953;
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .message.received .message-content {
                    background-color: white;
                    color: #333;
                    border: 1px solid #e0e0e0;
                    border-bottom-left-radius: 4px;
                }

                .message-time {
                    display: block;
                    font-size: 10px;
                    opacity: 0.8;
                    margin-top: 4px;
                    text-align: right;
                }

                .message-input {
                    display: flex;
                    padding: 12px;
                    border-top: 1px solid #e0e0e0;
                    background-color: white;
                }

                .message-input input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    outline: none;
                    font-size: 14px;
                }

                .message-input button {
                    margin-left: 8px;
                    padding: 8px 16px;
                    background-color: #061953;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                }

                .message-input button:hover {
                    background-color: #0a2463;
                }

                .back-button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0 8px 0 0;
                }
            `}</style>
        </div>
    );
};

export default ChatIcon;