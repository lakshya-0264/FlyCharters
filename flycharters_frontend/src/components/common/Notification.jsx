import React, { useState, useEffect, useRef } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuRefreshCw } from "react-icons/lu";
import { IoMdNotificationsOff } from "react-icons/io";
import { getNotifications, markNotificationsAsRead } from "../../api/authAPI";
import { IoClose } from "react-icons/io5";
import loadingGif from "../../assets/LoadingGIF.gif";
import { io } from "socket.io-client";

const NotificationIcon = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!userId) return;
        const newSocket = io("http://localhost:8080", {
            withCredentials: true,
        });
        newSocket.on("connect", () => {
            newSocket.emit("join", userId);
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [userId]);

    useEffect(() => {
        if (!socket || !userId) return;
        socket.on("new-notification", (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });
        return () => socket.off("new-notification");
    }, [socket, userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotifications();
            const all = res.data.data || [];
            const sorted = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sorted);
            setUnreadCount(sorted.filter((n) => !n.isRead).length);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    if (userId) {
        fetchNotifications();
    }
    }, [userId]);

    const togglePanel = () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);
        if (willOpen) {
            fetchNotifications();
        }
    };

    const closePanel = async () => {
        setIsOpen(false);
        try {
            await markNotificationsAsRead();
            const updated = notifications.map((n) => ({ ...n, isRead: true }));
            setNotifications(updated);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark notifications as read", err);
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
}); 
    return (
        <div className="notification-wrapper" ref={wrapperRef}>
            <div className="notification-icon" onClick={togglePanel}>
                <IoIosNotificationsOutline style={{ height: "90%", width: "90%" }} />
                {unreadCount > 0 && (
                    <span className="notif-badge z-100">{unreadCount}</span>
                )}
            </div>

            {isOpen && (
                <>
                    <div className="overlay" onClick={closePanel}></div>
                    <div className="notification-popup">
                        <div className="notification-header">
                            <h4>Notifications</h4>
                            <div className="icons">
                                <LuRefreshCw
                                    className={`refresh-icon ${loading ? "spin" : ""}`}
                                    onClick={fetchNotifications}
                                />
                                <IoClose className="close-icon" onClick={closePanel} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <img src={loadingGif} alt="Loading..." />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="empty-state">
                                <IoMdNotificationsOff style={{ fontSize: "100px", color: "#E6E6E6" }} />
                                <p><strong>Currently, nothing to report!</strong></p>
                                <p>This area will light up with new notifications once there's activity.</p>
                            </div>
                        ) : (
                            <ul className="notif-list">
                                {notifications.map((notif, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            backgroundColor: notif.isRead ? "white" : "#e6ffe6",
                                            padding: "10px",
                                            marginBottom: "8px",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        <strong>{notif.title}</strong>
                                        <p>{notif.message}</p>
                                        <small>{new Date(notif.createdAt).toLocaleString()}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationIcon;
