/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TeamChannel.module.css';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { jwtDecode } from "jwt-decode";

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');

const imageCache = new Map();

const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    return `${baseUrl}/api${imgPath}`;
};

const ProfileImage = ({ photoPath, userName }) => {

    
    const [displayImage, setDisplayImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfileImage = async (imagePath) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!imagePath) {
                setDisplayImage('');
                setIsLoading(false);
                return;
            }

            const fullUrl = getFullImageUrl(imagePath);

            if (imageCache.has(fullUrl)) {
                setDisplayImage(imageCache.get(fullUrl));
                setIsLoading(false);
                return;
            }

            if (fullUrl.startsWith('http')) {
                const response = await axios.get(fullUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob'
                });

                const imageUrl = URL.createObjectURL(response.data);
                imageCache.set(fullUrl, imageUrl);
                setDisplayImage(imageUrl);
            } else {
                setDisplayImage(fullUrl);
            }
        } catch (error) {
            setDisplayImage('');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (photoPath) {
            fetchProfileImage(photoPath);
        } else {
            setDisplayImage('');
            setIsLoading(false);
        }
    }, [photoPath]);

    useEffect(() => {
        return () => {
            if (displayImage && displayImage.startsWith('blob:') && !Array.from(imageCache.values()).includes(displayImage)) {
                URL.revokeObjectURL(displayImage);
            }
        };
    }, [displayImage]);

    if (isLoading) {
        return (
            <div className={styles.avatarPlaceholder}>
                <div className={styles.avatarLoading}></div>
            </div>
        );
    }

    return displayImage ? (
        <img
            src={displayImage}
            alt={userName}
            className={styles.avatarImage}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.webp";
            }}
        />
    ) : (
        <div className={styles.avatarPlaceholder}>
            {userName?.charAt(0) || '?'}
        </div>
    );
};

const TeamChannel = () => {
    const { channelName, channelId, communityId, teamId } = useParams();

    const [messages, setMessages] = useState([]);
    const [threads, setThreads] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeThread, setActiveThread] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentThreadPage, setCurrentThreadPage] = useState(1);
    const [totalMessages, setTotalMessages] = useState(0);
    const [totalThreads, setTotalThreads] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingThreads, setIsLoadingThreads] = useState(false);
    const [isLoadingMoreThreads, setIsLoadingMoreThreads] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [hasMoreThreads, setHasMoreThreads] = useState(false);
    const [showingExpandedThreads, setShowingExpandedThreads] = useState(false);
    const [showingExpandedMessages, setShowingExpandedMessages] = useState(false);
    const MESSAGES_PER_PAGE = 15;
    const THREADS_PER_PAGE = 15;

    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.payload?.UserId;
                setCurrentUserId(userId);
                fetchLeaderStatus();
            }
        } catch (error) { /* empty */ }
    }, []);

    const fetchLeaderStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/auth`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                }
            );

            if (response.data.Success) {
                setIsLeader(response.data.Data.IsLeader);
            }
        } catch (error) { /* empty */ }
    };

    const canDeleteMessage = (message) => {
        if (!currentUserId || !message) return false;
        if (isLeader) return true;
        if (message.UserId) {
            return message.UserId === currentUserId;
        }
        if (message.User && message.User.Id) {
            return message.User.Id === currentUserId;
        }
        return false;
    };

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(`wss://bridgex.api.abdullahabaza.me`, {
            withCredentials: true,
            query: { token },
            transports: ['websocket']
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            socketRef.current.emit('JoinChannel', {
                ChannelId: channelId,
                ThreadId: activeThread || null
            });
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', () => {
            setIsConnected(false);
            toast.error('Connection error. Reconnecting...', {
                position: "top-center",
                autoClose: 1500
            });
        });

        socketRef.current.on('chat_deleted', (messageId) => {
            setMessages(prev => {
                const newMessages = prev.filter(msg => msg.Id !== messageId);
                setTotalMessages(prev => Math.max(0, prev - 1));
                return newMessages;
            });
        });

        socketRef.current.on('chat_thread', (thread) => {
            setThreads(prev => {
                const updatedThreads = [...prev, thread];
                if (updatedThreads.length > THREADS_PER_PAGE) {
                    setHasMoreThreads(true);
                    return updatedThreads.slice(-THREADS_PER_PAGE);
                }
                return updatedThreads;
            });
            setTotalThreads(prev => prev + 1);
        });

        socketRef.current.on('totalUsers', (data) => {
            setTotalUsers(data.Count);
        });

        socketRef.current.on('error', (error) => {
            toast.error(`WebSocket error: ${error.message || error}`, {
                position: "top-center",
                autoClose: 1500
            });
        });

        socketRef.current.on('Error', (error) => {
            toast.error(`WebSocket Error: ${error.message || error}`, {
                position: "top-center",
                autoClose: 1500
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [channelId, activeThread]);

    useEffect(() => {
        if (!socketRef.current || !isConnected) return;
        socketRef.current.emit('JoinChannel', {
            ChannelId: channelId,
            ThreadId: activeThread || null
        });
        fetchMessages();
    }, [activeThread, isConnected, channelId]);

    const fetchMessages = async (page = 1, append = false) => {
        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await axios.get(
                `${baseUrl}/api/teams/channels/${channelId}?page=${page}&threadId=${activeThread || ''}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                }
            );

            if (response.data.Success) {
                const newMessages = response.data.Data.Data || [];
                const totalCount = response.data.Data.Count || 0;
                setTotalMessages(totalCount);
                const hasMore = totalCount > (page * MESSAGES_PER_PAGE);
                setHasMoreMessages(hasMore);

                if (append) {
                    const sortedNewMessages = [...newMessages].sort((a, b) => {
                        const dateA = new Date(a.CreatedAt || 0);
                        const dateB = new Date(b.CreatedAt || 0);
                        return dateA - dateB;
                    });
                    setMessages(prev => [...sortedNewMessages, ...prev]);
                } else {
                    const sortedMessages = [...newMessages].sort((a, b) => {
                        const dateA = new Date(a.CreatedAt || 0);
                        const dateB = new Date(b.CreatedAt || 0);
                        return dateA - dateB;
                    });
                    setMessages(sortedMessages);
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                }
                setCurrentPage(page);
            }
        } catch (err) {
            toast.error(err.message || "Failed to load messages", {
                position: "top-center",
                autoClose: 1500
            });
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const handleLoadMoreMessages = () => {
        if (isLoadingMore || !hasMoreMessages) return;
        fetchMessages(currentPage + 1, true);
        setShowingExpandedMessages(true);
    };

    const handleCollapseMessages = () => {
        setCurrentPage(1);
        fetchMessages(1, false);
        setShowingExpandedMessages(false);
    };

    const fetchThreads = async (page = 1, append = false) => {
        if (page === 1) {
            setIsLoadingThreads(true);
        } else {
            setIsLoadingMoreThreads(true);
        }

        try {
            const response = await axios.get(
                `${baseUrl}/api/teams/channels/${channelId}/threads?page=${page}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                }
            );

            if (response.data.Success) {
                const newThreads = response.data.Data.Data || [];
                const totalCount = response.data.Data.Count || 0;
                setTotalThreads(totalCount);
                const hasMore = totalCount > (page * THREADS_PER_PAGE);
                setHasMoreThreads(hasMore);
                const reversedThreads = [...newThreads].reverse();

                if (append) {
                    setThreads(prev => [...reversedThreads, ...prev]);
                } else {
                    setThreads(reversedThreads);
                }
                setCurrentThreadPage(page);
            }
        } catch (err) {
            toast.error(err.message || "Failed to load threads", {
                position: "top-center",
                autoClose: 1500
            });
        } finally {
            setIsLoadingThreads(false);
        }
    };

    const handleLoadMoreThreads = () => {
        if (isLoadingMoreThreads || !hasMoreThreads) return;
        fetchThreads(currentThreadPage + 1, true);
        setShowingExpandedThreads(true);
    };

    const handleCollapseThreads = () => {
        setCurrentThreadPage(1);
        fetchThreads(1, false);
        setShowingExpandedThreads(false);
    };

    useEffect(() => {
        setMessages([]);
        setCurrentPage(1);
        setShowingExpandedMessages(false);
        fetchMessages(1, false);
        if (!activeThread) {
            setThreads([]);
            setCurrentThreadPage(1);
            setShowingExpandedThreads(false);
            fetchThreads(1, false);
        }
    }, [channelId, activeThread]);

    useEffect(() => {
        if (!socketRef.current) return;
        const handleNewThread = (thread) => {
            setThreads(prevThreads => {
                const threadExists = prevThreads.some(t => t.Id === thread.Id);
                if (threadExists) {
                    return prevThreads;
                }
                return [...prevThreads, thread];
            });
            setTotalThreads(prev => prev + 1);
        };
        socketRef.current.on('chat_thread', handleNewThread);
        return () => {
            socketRef.current.off('chat_thread', handleNewThread);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const payload = {
                Message: newMessage,
                ReplyToId: replyingTo?.Id || null,
                ThreadId: activeThread || null
            };
            const response = await axios.post(
                `${baseUrl}/api/teams/channels/${channelId}`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.Success) {
                setNewMessage('');
                setReplyingTo(null);
            }
        } catch (err) {
            toast.error(err.message, {
                position: "top-center",
                autoClose: 1500
            });
        }
    };

    const handleCreateThread = async (messageId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/teams/channels/${channelId}/${messageId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                }
            );
            if (response.data.Success) {
                toast.success("Thread created!", {
                    position: "top-center",
                    autoClose: 1500
                });
            } else {
                toast.error(response.data.Message || "Failed to create thread", {
                    position: "top-center",
                    autoClose: 1500
                });
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data?.Message || `Server error: ${err.response.status}`, {
                    position: "top-center",
                    autoClose: 1500
                });
            } else if (err.request) {
                toast.error("No response from server. Please check your connection.", {
                    position: "top-center",
                    autoClose: 1500
                });
            } else {
                toast.error(`Error: ${err.message}`, {
                    position: "top-center",
                    autoClose: 1500
                });
            }
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await axios.delete(
                `${baseUrl}/api/teams/channels/${channelId}/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );
            if (response.status === 200) {
                setMessages(prev => {
                    return prev.map(msg =>
                        msg.Id === messageId
                            ? { ...msg, Message: 'Deleted message', IsDeleted: true }
                            : msg
                    );
                });
                toast.success("Message deleted!", {
                    position: "top-center",
                    autoClose: 1500
                });
            }
        } catch (err) {
            toast.error(err.message || "Failed to delete message", {
                position: "top-center",
                autoClose: 1500
            });
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Just now';
            }
            return date.toLocaleString();
        } catch (error) {
            return 'Just now';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (!socketRef.current) return;
        const handleNewMessage = (message) => {
            if (activeThread) {
                message.ThreadId = activeThread;
            }
            const belongsToCurrentView =
                (!activeThread && !message.ThreadId) ||
                (activeThread && message.ThreadId === activeThread);
            if (belongsToCurrentView) {
                if (!message.CreatedAt) {
                    message.CreatedAt = new Date().toISOString();
                }
                setMessages(prev => {
                    const updatedMessages = [...prev, message];
                    if (updatedMessages.length > MESSAGES_PER_PAGE) {
                        setHasMoreMessages(true);
                        return updatedMessages.slice(-MESSAGES_PER_PAGE);
                    }
                    return updatedMessages;
                });
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
                setTotalMessages(prevTotal => prevTotal + 1);
            }
        };
        socketRef.current.on('chat', handleNewMessage);
        return () => {
            socketRef.current.off('chat', handleNewMessage);
        };
    }, [activeThread, MESSAGES_PER_PAGE]);

    useEffect(() => {
        if (!socketRef.current) return;
        const handleMessageDeleted = (deletedMessage) => {
            if (typeof deletedMessage !== 'object') {
                setMessages(prev => {
                    const newMessages = prev.filter(msg => msg.Id !== deletedMessage);
                    setTotalMessages(prev => Math.max(0, prev - 1));
                    return newMessages;
                });
                return;
            }
            const messageId = deletedMessage.Id;
            const messageExists = messages.some(msg => msg.Id === messageId);
            if (messageExists) {
                if (deletedMessage.Message === 'Deleted message') {
                    setMessages(prev => {
                        return prev.map(msg =>
                            msg.Id === messageId
                                ? { ...msg, Message: 'Deleted message', IsDeleted: true }
                                : msg
                        );
                    });
                } else {
                    setMessages(prev => {
                        const newMessages = prev.filter(msg => msg.Id !== messageId);
                        setTotalMessages(prev => Math.max(0, prev - 1));
                        return newMessages;
                    });
                }
            }
        };
        socketRef.current.on('chat_deleted', handleMessageDeleted);
        return () => {
            socketRef.current.off('chat_deleted', handleMessageDeleted);
        };
    }, [activeThread, messages]);

    useEffect(() => {
    }, [messages]);

    useEffect(() => {
        if (totalMessages > MESSAGES_PER_PAGE && !hasMoreMessages) {
            setHasMoreMessages(true);
        }
        if (totalThreads > THREADS_PER_PAGE && !hasMoreThreads) {
            setHasMoreThreads(true);
        }
    }, [totalMessages, totalThreads, hasMoreMessages, hasMoreThreads]);

    return (
        <div className={styles.channelPage}>
            <ScrollToTop />
            <div className={styles.channelPageContainer}>
                <div className={styles.chatLayout}>
                    <div className={styles.threadsPanel}>
                        <div className={styles.threadsPanelHeader}>
                            <h3>Conversations</h3>
                            {activeThread && (
                                <button
                                    className={styles.mainChannelButton}
                                    onClick={() => setActiveThread(null)}
                                >
                                    <i className="fa-solid fa-arrow-left"></i> Main Channel
                                </button>
                            )}
                        </div>
                        <div className={styles.threadsList}>
                            {isLoadingThreads && threads.length === 0 ? (
                                <div className={styles.loadingIndicator}>
                                    <div className={styles.loadingSpinner}></div>
                                    <span>Loading threads...</span>
                                </div>
                            ) : threads.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <i className="fa-solid fa-comment-dots"></i>
                                    <p>No threads yet</p>
                                </div>
                            ) : (
                                <>
                                    {!activeThread && (
                                        <div className={styles.loadMoreContainer}>
                                            {showingExpandedThreads ? (
                                                <button
                                                    className={styles.loadMoreButton}
                                                    onClick={handleCollapseThreads}
                                                    disabled={isLoadingThreads}
                                                >
                                                    {isLoadingThreads ? (
                                                        <>
                                                            <div className={styles.smallSpinner}></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-compress-alt"></i>
                                                            Show Less
                                                        </>
                                                    )}
                                                </button>
                                            ) : (hasMoreThreads && threads.length >= THREADS_PER_PAGE) ? (
                                                <button
                                                    className={styles.loadMoreButton}
                                                    onClick={handleLoadMoreThreads}
                                                    disabled={isLoadingMoreThreads}
                                                >
                                                    {isLoadingMoreThreads ? (
                                                        <>
                                                            <div className={styles.smallSpinner}></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-arrow-up"></i>
                                                            Load More
                                                        </>
                                                    )}
                                                </button>
                                            ) : null}
                                        </div>
                                    )}
                                    {threads.map(thread => (
                                        <div
                                            key={thread.Id}
                                            className={`${styles.threadItem} ${activeThread === thread.Id ? styles.activeThreadItem : ''}`}
                                            onClick={() => setActiveThread(thread.Id)}
                                        >
                                            <div className={styles.threadIcon}>
                                                <i className="fa-solid fa-comment-dots"></i>
                                            </div>
                                            <div className={styles.threadInfo}>
                                                <span className={styles.threadName}>{thread.ThreadName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles.chatContent}>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderInfo}>
                                <h2>{activeThread ? threads.find(t => t.Id === activeThread)?.ThreadName : channelName}</h2>
                                <div className={styles.connectionStatusIndicator}>
                                    <div className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></div>
                                    <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                                </div>
                            </div>
                            {isConnected && totalUsers !== undefined && (
                                <div className={styles.userCountBadge}>
                                    <i className="fa-solid fa-users"></i>
                                    <span>{totalUsers} online</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.messagesArea}>
                            {isLoading ? (
                                <div className={styles.loadingIndicator}>
                                    <div className={styles.loadingSpinner}></div>
                                    <span>Loading messages...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <i className="fa-solid fa-comments"></i>
                                    <h3>No messages yet</h3>
                                    <p>Start the conversation!</p>
                                </div>
                            ) : (
                                <div className={styles.messagesList} key={`messages-${messages.map(m => m.Id).join('-')}`}>
                                    <div className={styles.loadMoreContainer}>
                                        {showingExpandedMessages ? (
                                            <button
                                                className={styles.loadMoreButton}
                                                onClick={handleCollapseMessages}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className={styles.smallSpinner}></div>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-compress-alt"></i>
                                                        Show Less
                                                    </>
                                                )}
                                            </button>
                                        ) : hasMoreMessages ? (
                                            <button
                                                className={styles.loadMoreButton}
                                                onClick={handleLoadMoreMessages}
                                                disabled={isLoadingMore}
                                            >
                                                {isLoadingMore ? (
                                                    <>
                                                        <div className={styles.smallSpinner}></div>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-arrow-up"></i>
                                                        Load More Messages
                                                    </>
                                                )}
                                            </button>
                                        ) : null}
                                    </div>
                                    {messages.map(message => (
                                        <div
                                            key={message.Id}
                                            className={`${styles.messageCard} ${replyingTo?.Id === message.Id ? styles.highlightedMessage : ''} ${message.IsDeleted || message.Message === 'Deleted message' ? styles.deletedMessage : ''}`}
                                        >
                                            <div className={styles.messageAvatar}>
                                                <ProfileImage
                                                    photoPath={message.User?.ProfilePhoto}
                                                    userName={message.User?.FirstName}
                                                />
                                            </div>
                                            <div className={styles.messageContent}>
                                                <div className={styles.messageMetadata}>
                                                    <span className={styles.userName}>
                                                        {message.User?.FirstName} {message.User.LastName}
                                                    </span>
                                                    <span className={styles.messageTime}>
                                                        {formatDate(message.CreatedAt)}
                                                    </span>
                                                </div>
                                                {message.ReplyTo && (
                                                    <div className={`${styles.repliedMessage}`}>
                                                        <i className="fa-solid fa-reply"></i>
                                                        <div className={styles.replyAvatarContainer}>
                                                            {message.ReplyTo.User ? (
                                                                <ProfileImage
                                                                    photoPath={message.ReplyTo.User?.ProfilePhoto}
                                                                    userName={message.ReplyTo.User?.FirstName}
                                                                />
                                                            ) : (
                                                                <div className={styles.avatarPlaceholder}>?</div>
                                                            )}
                                                        </div>
                                                        <span className={styles.replyAuthor}>
                                                            {message.ReplyTo.User?.FirstName || 'Unknown'}:
                                                        </span>
                                                        <span className={styles.replyText}>
                                                            {message.ReplyTo.Message}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`${styles.messageText} ${message.IsDeleted || message.Message === 'Deleted message' ? styles.deletedMessageText : ''}`}>
                                                    {message.IsDeleted || message.Message === 'Deleted message'
                                                        ? (
                                                            <>
                                                                <i className="fa-solid fa-ban"></i>
                                                                <span>This message was deleted</span>
                                                            </>
                                                        )
                                                        : message.Message
                                                    }
                                                </div>
                                                {!message.IsDeleted && message.Message !== 'Deleted message' && (
                                                    <div className={styles.messageActions}>
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => {
                                                                setReplyingTo(message);
                                                            }}
                                                            title="Reply"
                                                        >
                                                            <i className="fa-solid fa-reply"></i>
                                                        </button>
                                                        {!activeThread && (
                                                            <button
                                                                className={styles.actionButton}
                                                                onClick={() => handleCreateThread(message.Id)}
                                                                title="Create Thread"
                                                            >
                                                                <i className="fa-solid fa-comments"></i>
                                                            </button>
                                                        )}
                                                        {canDeleteMessage(message) && (
                                                            <button
                                                                className={styles.actionButton}
                                                                onClick={() => handleDeleteMessage(message.Id)}
                                                                title="Delete"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
                                </div>
                            )}
                        </div>
                        <div className={styles.messageInputArea}>
                            {replyingTo && (
                                <div className={styles.replyingToIndicator}>
                                    <span>Replying to <strong>{replyingTo.User.FirstName}</strong></span>
                                    <button onClick={() => setReplyingTo(null)}>
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            )}
                            <div className={styles.messageInputContainer}>
                                <textarea
                                    className={styles.messageInput}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    className={styles.sendButton}
                                    onClick={handleSendMessage}
                                    title="Send message"
                                >
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamChannel;