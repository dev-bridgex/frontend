/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SubTeamChannel.module.css';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

const token =localStorage.getItem('token');

const SubTeamChannel = () => {

    const { channelName, channelId } = useParams();
    

    // State management
    const [messages, setMessages] = useState([]);
    const [threads, setThreads] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeThread, setActiveThread] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMessages, setTotalMessages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Initialize WebSocket connection with detailed logging
    useEffect(() => {
        console.log('[WebSocket] Setting up WebSocket connection...');
        console.log(`[WebSocket] Connecting to: wss://bridgex.api.abdullahabaza.me`);

        socketRef.current = io(`wss://bridgex.api.abdullahabaza.me`, {
            withCredentials: true,
            extraHeaders: {
                token: token
            },
            transports: ['websocket']
        });

        // Connection events with detailed logging
        socketRef.current.on('connect', () => {
            setIsConnected(true);

            console.log(`[WebSocket] Joining channel: ${channelId}, thread: ${activeThread || 'main'}`);
            socketRef.current.emit('joinChannel', {
                ChannelId: channelId,
                ThreadId: activeThread || null
            });
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log(`[WebSocket] ❌ Disconnected: ${reason}`);
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('[WebSocket] 🔴 Connection error:', err);
            setIsConnected(false);
            toast.error('Connection error. Trying to reconnect...', { autoClose: 2000 });
        });

        // Message events with detailed logging
        socketRef.current.on('newMessage', (message) => {
            console.log('[WebSocket] 📨 New message received:', message);
            console.log(`[WebSocket] Current active thread: ${activeThread || 'main'}`);

            // Check if message belongs to current view
            const belongsToCurrentView =
                (!activeThread && !message.ThreadId) ||
                (activeThread && message.ThreadId === activeThread);

            console.log(`[WebSocket] Message belongs to current view: ${belongsToCurrentView}`);

            if (belongsToCurrentView) {
                console.log('[WebSocket] Adding message to state');
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            } else {
                console.log('[WebSocket] Ignoring message (not for current view)');
            }
        });

        socketRef.current.on('messageDeleted', (messageId) => {
            console.log(`[WebSocket] 🗑️ Message deleted: ${messageId}`);
            setMessages(prev => prev.filter(msg => msg.Id !== messageId));
        });

        socketRef.current.on('newThread', (thread) => {
            console.log('[WebSocket] 🧵 New thread created:', thread);
            setThreads(prev => [...prev, thread]);
        });

        // Cleanup function with logging
        return () => {
            console.log('[WebSocket] 🧹 Cleaning up WebSocket connection');
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [channelId]);

    // Handle active thread changes
    useEffect(() => {
        if (!socketRef.current || !isConnected) return;

        console.log(`[Thread] Active thread changed to: ${activeThread || 'main'}`);
        console.log('[WebSocket] Rejoining channel with new thread');
        socketRef.current.emit('joinChannel', {
            channelId: channelId,
            threadId: activeThread || null
        });
        fetchMessages();
    }, [activeThread]);

    // Fetch messages from API with detailed logging
    const fetchMessages = async () => {
        console.log(`[API] 🚀 Fetching messages for channel ${channelId}, thread ${activeThread || 'main'}`);
        setIsLoading(true);

        try {
            const url = `${baseUrl}/api/subteams/channels/${channelId}?page=1&threadId=${activeThread || ''}`;
            console.log(`[API] Request URL: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'accept': 'application/json'
                }
            });

            console.log('[API] Response received:', response.data);

            if (response.data.Success) {
                console.log(`[API] Retrieved ${response.data.Data.Data.length} messages`);
                setMessages(response.data.Data.Data);
                setTotalMessages(response.data.Data.Count);
                scrollToBottom();
            } else {
                throw new Error(response.data.Message);
            }
        } catch (err) {
            console.error('[API] Error fetching messages:', err);
            toast.error(err.message, { autoClose: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch threads from API with detailed logging
    const fetchThreads = async () => {
        console.log(`[API] 🧵 Fetching threads for channel ${channelId}`);

        try {
            const response = await axios.get(
                `${baseUrl}/api/subteams/channels/${channelId}/threads?page=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'accept': 'application/json'
                    }
                }
            );

            console.log('[API] Threads response:', response.data);

            if (response.data.Success) {
                console.log(`[API] Retrieved ${response.data.Data.Data.length} threads`);
                setThreads(response.data.Data.Data);
            } else {
                throw new Error(response.data.Message);
            }
        } catch (err) {
            console.error('[API] Error fetching threads:', err);
            toast.error(err.message, { autoClose: 2000 });
        }
    };

    // Initial data fetch
    useEffect(() => {
        console.log('[Component] ⚡ Initial data load');
        fetchMessages();
        if (!activeThread) {
            fetchThreads();
        }
    }, [channelId, activeThread]);

    // Handle sending message with detailed logging
    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            console.log('[Message] Empty message, not sending');
            return;
        }

        console.log('[Message] ✉️ Preparing to send message:', {
            text: newMessage,
            replyTo: replyingTo?.Id,
            threadId: activeThread
        });

        try {
            const response = await axios.post(
                `${baseUrl}/api/subteams/channels/${channelId}`,
                {
                    Message: newMessage,
                    ReplyToId: replyingTo?.Id || null,
                    ThreadId: activeThread || null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('[Message] Send response:', response.data);

            if (response.data.Success) {
                console.log('[Message] ✅ Message sent successfully');
                setNewMessage('');
                setReplyingTo(null);
            } else {
                throw new Error(response.data.Message);
            }
        } catch (err) {
            console.error('[Message] Error sending message:', err);
            toast.error(err.message, { autoClose: 2000 });
        }
    };

    // Handle creating thread with detailed logging
    const handleCreateThread = async (messageId) => {
        console.log(`[Thread] Creating new thread from message ${messageId}`);

        try {
            const response = await axios.post(
                `${baseUrl}/api/subteams/channels/${channelId}/${messageId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'accept': 'application/json'
                    }
                }
            );

            console.log('[Thread] Create response:', response.data);

            if (response.data.Success) {
                console.log('[Thread] ✅ Thread created successfully');
                toast.success("Thread created successfully!", { autoClose: 1000 });
            } else {
                throw new Error(response.data.Message);
            }
        } catch (err) {
            console.error('[Thread] Error creating thread:', err);
            toast.error(err.message, { autoClose: 2000 });
        }
    };

    // Handle deleting message with detailed logging
    const handleDeleteMessage = async (messageId) => {
        console.log(`[Message] Deleting message ${messageId}`);

        try {
            const response = await axios.delete(
                `${baseUrl}/api/subteams/channels/${channelId}/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'accept': '*/*'
                    }
                }
            );

            console.log('[Message] Delete response:', response);

            if (response.status === 200) {
                console.log('[Message] ✅ Message deleted successfully');
                toast.success("Message deleted successfully!", { autoClose: 1000 });
            } else {
                throw new Error(response.data?.Message || 'Unknown error');
            }
        } catch (err) {
            console.error('[Message] Error deleting message:', err);
            toast.error(err.message, { autoClose: 2000 });
        }
    };

    // Helper functions
    const scrollToBottom = () => {
        console.log('[UI] Scrolling to bottom');
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Render UI with connection status
    return (
        <div className={styles.channelPage}>
            {/* Connection status indicator */}
            <div className={styles.connectionStatus}>
                WebSocket Status:
                {isConnected ? (
                    <span className={styles.connected}>✅ Connected</span>
                ) : (
                    <span className={styles.disconnected}>❌ Disconnected</span>
                )}
            </div>

            <div className={styles.channelPageContainer}>
                <div className={styles.chatLayout}>
                    {/* Threads panel */}
                    <div className={styles.threadsPanel}>
                        <div className={styles.threadsPanelHeader}>
                            <h3>Conversations</h3>
                            {activeThread && (
                                <button
                                    className={styles.mainChannelButton}
                                    onClick={() => {
                                        console.log('[UI] Switching to main channel');
                                        setActiveThread(null);
                                    }}
                                >
                                    <i className="fa-solid fa-arrow-left"></i> Main Channel
                                </button>
                            )}
                        </div>

                        <div className={styles.threadsList}>
                            {threads.map(thread => (
                                <div
                                    key={thread.Id}
                                    className={`${styles.threadItem} ${activeThread === thread.Id ? styles.activeThreadItem : ''}`}
                                    onClick={() => {
                                        console.log(`[UI] Switching to thread: ${thread.Id}`);
                                        setActiveThread(thread.Id);
                                    }}
                                >
                                    <div className={styles.threadIcon}>
                                        <i className="fa-solid fa-comment-dots"></i>
                                    </div>
                                    <div className={styles.threadInfo}>
                                        <span className={styles.threadName}>{thread.ThreadName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat content */}
                    <div className={styles.chatContent}>
                        <div className={styles.chatHeader}>
                            <h2>{activeThread ? threads.find(t => t.Id === activeThread)?.ThreadName : channelName}</h2>
                        </div>

                        {/* Messages area */}
                        <div className={styles.messagesArea}>
                            {isLoading ? (
                                <div className={styles.loadingIndicator}>
                                    <div className={styles.loadingSpinner}></div>
                                    <span>Loading messages...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateIcon}>
                                        <i className="fa-solid fa-comments"></i>
                                    </div>
                                    <h3>No messages yet</h3>
                                    <p>Start the conversation by sending a message!</p>
                                </div>
                            ) : (
                                <div className={styles.messagesList}>
                                    {messages.map(message => (
                                        <div
                                            key={message.Id}
                                            className={`${styles.messageCard} ${replyingTo?.Id === message.Id ? styles.highlightedMessage : ''}`}
                                        >
                                            <div className={styles.messageAvatar}>
                                                {message.User.ProfilePhoto ? (
                                                    <img src={message.User.ProfilePhoto} alt={message.User.FirstName} />
                                                ) : (
                                                    <div className={styles.avatarFallback}>
                                                        {message.User.FirstName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.messageContent}>
                                                <div className={styles.messageMetadata}>
                                                    <span className={styles.userName}>{message.User.FirstName} {message.User.LastName}</span>
                                                    <span className={styles.messageTime}>{formatDate(message.CreatedAt)}</span>
                                                </div>

                                                {message.ReplyTo && (
                                                    <div className={styles.repliedMessage}>
                                                        <div className={styles.replyIndicator}>
                                                            <i className="fa-solid fa-reply"></i>
                                                        </div>
                                                        <div className={styles.replyPreview}>
                                                            <span className={styles.replyAuthor}>{message.ReplyTo.User.FirstName}:</span>
                                                            <span className={styles.replyText}>{message.ReplyTo.Message}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={styles.messageText}>{message.Message}</div>

                                                <div className={styles.messageActions}>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => {
                                                            console.log(`[UI] Replying to message ${message.Id}`);
                                                            setReplyingTo(message);
                                                        }}
                                                        title="Reply"
                                                    >
                                                        <i className="fa-solid fa-reply"></i>
                                                    </button>

                                                    {!activeThread && (
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => {
                                                                console.log(`[UI] Creating thread from message ${message.Id}`);
                                                                handleCreateThread(message.Id);
                                                            }}
                                                            title="Create Thread"
                                                        >
                                                            <i className="fa-solid fa-comments"></i>
                                                        </button>
                                                    )}

                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => {
                                                            console.log(`[UI] Deleting message ${message.Id}`);
                                                            handleDeleteMessage(message.Id);
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message input area */}
                        <div className={styles.messageInputArea}>
                            {replyingTo && (
                                <div className={styles.replyingToIndicator}>
                                    <span>Replying to <strong>{replyingTo.User.FirstName}</strong></span>
                                    <button onClick={() => {
                                        console.log('[UI] Canceling reply');
                                        setReplyingTo(null);
                                    }}>
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            )}
                            <div className={styles.messageInputContainer}>
                                <textarea
                                    className={styles.messageInput}
                                    placeholder="Type your message here..."
                                    value={newMessage}
                                    onChange={(e) => {
                                        console.log('[UI] Message input changed');
                                        setNewMessage(e.target.value);
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    className={styles.sendButton}
                                    onClick={() => {
                                        console.log('[UI] Send button clicked');
                                        handleSendMessage();
                                    }}
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

export default SubTeamChannel;