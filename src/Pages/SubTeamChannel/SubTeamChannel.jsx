/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SubTeamChannel.module.css';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { jwtDecode } from "jwt-decode";

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');

// Cache for storing already loaded images to prevent duplicate requests
const imageCache = new Map();

// Function to construct full image URL (same as in ProfilePhotoSection)
const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    return `${baseUrl}/api${imgPath}`;
};

// Component to handle profile image loading with authorization
const ProfileImage = ({ photoPath, userName }) => {
    const [displayImage, setDisplayImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Method to fetch preview image with axios (similar to ProfilePhotoSection)
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

            // Check if this image is already in our cache
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
                // Store in cache for future use
                imageCache.set(fullUrl, imageUrl);
                setDisplayImage(imageUrl);
            } else {
                setDisplayImage(fullUrl);
            }
        // eslint-disable-next-line no-unused-vars
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

    // Cleanup preview URLs when component unmounts
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

const SubTeamChannel = () => {
    const { channelName, channelId, communityId, teamId, subTeamId } = useParams();

    // State management
    const [messages, setMessages] = useState([]);
    const [threads, setThreads] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeThread, setActiveThread] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentThreadPage, setCurrentThreadPage] = useState(1); // Add thread pagination
    // eslint-disable-next-line no-unused-vars
    const [totalMessages, setTotalMessages] = useState(0);
    const [totalThreads, setTotalThreads] = useState(0); // Add total threads count
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingThreads, setIsLoadingThreads] = useState(false); // Add thread loading state
    const [isLoadingMoreThreads, setIsLoadingMoreThreads] = useState(false); // Add more threads loading state
    const [isConnected, setIsConnected] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [hasMoreThreads, setHasMoreThreads] = useState(false); // Add more threads state
    const [showingExpandedThreads, setShowingExpandedThreads] = useState(false); // Add state to track if we're showing expanded threads
    const [showingExpandedMessages, setShowingExpandedMessages] = useState(false); // Add state to track if we're showing expanded messages
    const MESSAGES_PER_PAGE = 15;
    const THREADS_PER_PAGE = 15; // Define threads per page


    // Add state to store current user ID and leader status
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLeader, setIsLeader] = useState(false);

    // Extract user ID from token when component mounts
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                // Extract user ID from token
                const userId = decodedToken.payload?.UserId;
                setCurrentUserId(userId);




                // Fetch leader status
                fetchLeaderStatus();
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) { /* empty */ }
    }, []);

    // Function to fetch leader status
    const fetchLeaderStatus = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/auth`,
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
        // eslint-disable-next-line no-unused-vars
        } catch (error) { /* empty */ }
    };

    // Function to check if user can delete a message
    const canDeleteMessage = (message) => {

        if (!currentUserId || !message) return false;

        // Leaders can delete any message
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

    // Initialize WebSocket connection
    useEffect(() => {

        socketRef.current = io(`wss://bridgex.api.abdullahabaza.me`, {
            withCredentials: true,
            query: { token },
            transports: ['websocket']
        });

        // Connection events
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

        // Message events are now handled in a separate useEffect

        socketRef.current.on('chat_deleted', (messageId) => {
            setMessages(prev => {
                const newMessages = prev.filter(msg => msg.Id !== messageId);
                // Update total count when a message is deleted
                setTotalMessages(prev => Math.max(0, prev - 1));
                return newMessages;
            });
        });

        socketRef.current.on('chat_thread', (thread) => {
            setThreads(prev => {
                const updatedThreads = [...prev, thread];

                // If we now have more than THREADS_PER_PAGE threads, 
                // keep only the most recent THREADS_PER_PAGE threads
                if (updatedThreads.length > THREADS_PER_PAGE) {
                    // Set hasMoreThreads to true since we now have more threads
                    setHasMoreThreads(true);
                    // Return only the most recent THREADS_PER_PAGE threads
                    return updatedThreads.slice(-THREADS_PER_PAGE);
                }

                return updatedThreads;
            });

            // Update total thread count for pagination
            setTotalThreads(prev => prev + 1);
        });

        socketRef.current.on('totalUsers', (data) => {
            setTotalUsers(data.Count); // Extract the Count property
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
    }, [channelId, activeThread]); // Add activeThread to dependencies

    // Handle thread changes
    useEffect(() => {
        if (!socketRef.current || !isConnected) return;


        socketRef.current.emit('JoinChannel', {
            ChannelId: channelId,
            ThreadId: activeThread || null
        });

        fetchMessages();
    }, [activeThread, isConnected, channelId]);

    // Fetch messages
    const fetchMessages = async (page = 1, append = false) => {
        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await axios.get(
                `${baseUrl}/api/subteams/channels/${channelId}?page=${page}&threadId=${activeThread || ''}`,
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

                // Improved calculation for hasMore
                const hasMore = totalCount > (page * MESSAGES_PER_PAGE);
                setHasMoreMessages(hasMore);

                if (append) {
                    // When loading more (older) messages, add them at the beginning
                    // Sort the new messages to ensure they're in the right order
                    const sortedNewMessages = [...newMessages].sort((a, b) => {
                        const dateA = new Date(a.CreatedAt || 0);
                        const dateB = new Date(b.CreatedAt || 0);
                        return dateA - dateB; // Ascending order (oldest first)
                    });

                    setMessages(prev => [...sortedNewMessages, ...prev]);
                } else {
                    // Initial load - sort messages by date (oldest first)
                    const sortedMessages = [...newMessages].sort((a, b) => {
                        const dateA = new Date(a.CreatedAt || 0);
                        const dateB = new Date(b.CreatedAt || 0);
                        return dateA - dateB; // Ascending order (oldest first)
                    });

                    setMessages(sortedMessages);
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                }

                // Update current page
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

    // Load more messages
    const handleLoadMoreMessages = () => {
        if (isLoadingMore || !hasMoreMessages) return;
        fetchMessages(currentPage + 1, true);
        setShowingExpandedMessages(true); // Set to true when we load more
    };

    // Add a function to collapse messages (show less)
    const handleCollapseMessages = () => {
        // Reset to page 1
        setCurrentPage(1);
        // Fetch only the first page of messages
        fetchMessages(1, false);
        // Update state to indicate we're not showing expanded messages
        setShowingExpandedMessages(false);
    };

    // Fetch threads
    const fetchThreads = async (page = 1, append = false) => {
        if (page === 1) {
            setIsLoadingThreads(true);
        } else {
            setIsLoadingMoreThreads(true);
        }

        try {
            const response = await axios.get(
                `${baseUrl}/api/subteams/channels/${channelId}/threads?page=${page}`,
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

                // Improved calculation for hasMore
                const hasMore = totalCount > (page * THREADS_PER_PAGE);
                setHasMoreThreads(hasMore);

                // Reverse the order of threads (oldest first)
                const reversedThreads = [...newThreads].reverse();

                if (append) {
                    // When loading more threads, prepend them to the existing list
                    // This will add older threads at the top
                    setThreads(prev => [...reversedThreads, ...prev]);
                } else {
                    // Initial load - replace existing threads
                    setThreads(reversedThreads);
                }

                // Update current thread page
                setCurrentThreadPage(page);
            }
        } catch (err) {
            toast.error(err.message || "Failed to load threads", {
                position: "top-center",
                autoClose: 1500
            });
        } finally {
            setIsLoadingThreads(false);
            setIsLoadingMoreThreads(false);
        }
    };

    // Load more threads
    const handleLoadMoreThreads = () => {
        if (isLoadingMoreThreads || !hasMoreThreads) return;
        fetchThreads(currentThreadPage + 1, true);
        setShowingExpandedThreads(true); // Set to true when we load more
    };

    // Add a function to collapse threads (show less)
    const handleCollapseThreads = () => {
        // Reset to page 1
        setCurrentThreadPage(1);
        // Fetch only the first page of threads
        fetchThreads(1, false);
        // Update state to indicate we're not showing expanded threads
        setShowingExpandedThreads(false);
    };

    // Initial data load
    useEffect(() => {
        setMessages([]); // Clear messages when changing channels or threads
        setCurrentPage(1); // Reset page when thread changes
        setShowingExpandedMessages(false); // Reset expanded messages state
        fetchMessages(1, false);
        if (!activeThread) {
            setThreads([]); // Clear threads when changing channels
            setCurrentThreadPage(1); // Reset thread page
            setShowingExpandedThreads(false); // Reset expanded threads state
            fetchThreads(1, false);
        }
    }, [channelId, activeThread]);

    // Socket event handler for new threads - completely rewritten
    useEffect(() => {
        if (!socketRef.current) return;

        // Define the handler function
        const handleNewThread = (thread) => {

            // Use functional update to ensure we're working with the latest state
            setThreads(prevThreads => {
                // Check if thread already exists in the current state
                const threadExists = prevThreads.some(t => t.Id === thread.Id);

                if (threadExists) {
                    return prevThreads;
                }

                return [...prevThreads, thread];
            });

            // Update total thread count for pagination
            setTotalThreads(prev => prev + 1);
        };

        // Register the event handler
        socketRef.current.on('chat_thread', handleNewThread);

        // Cleanup function
        return () => {
            socketRef.current.off('chat_thread', handleNewThread);
        };
    }, []); // Empty dependency array to ensure this only runs once



    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            
            const payload = {
                Message: newMessage,
                ReplyToId: replyingTo?.Id || null,
                ThreadId: activeThread || null
            };


            const response = await axios.post(
                `${baseUrl}/api/subteams/channels/${channelId}`,
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

    // Create thread
    const handleCreateThread = async (messageId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/subteams/channels/${channelId}/${messageId}`,
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
                // Handle case where API returns success: false
                toast.error(response.data.Message || "Failed to create thread", {
                    position: "top-center",
                    autoClose: 1500
                });
            }
        } catch (err) {

            // Improved error handling with more detailed messages
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(err.response.data?.Message || `Server error: ${err.response.status}`, {
                    position: "top-center",
                    autoClose: 1500
                });
            } else if (err.request) {
                // The request was made but no response was received
                toast.error("No response from server. Please check your connection.", {
                    position: "top-center",
                    autoClose: 1500
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error(`Error: ${err.message}`, {
                    position: "top-center",
                    autoClose: 1500
                });
            }
        }
    };

    // Delete message
    const handleDeleteMessage = async (messageId) => {
        try {

            const response = await axios.delete(
                `${baseUrl}/api/subteams/channels/${channelId}/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );

            if (response.status === 200) {

                // Update UI immediately after successful deletion
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

    // Helper functions
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            // Check if the date is valid
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Just now'; // Fallback for invalid dates
            }
            return date.toLocaleString();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return 'Just now'; // Fallback for any errors
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Socket event handler for new messages
    useEffect(() => {
        if (!socketRef.current) return;

        const handleNewMessage = (message) => {

            // Check if the message has ThreadId property at all
            if (activeThread) {
                message.ThreadId = activeThread;
            }

            // Check if message belongs to current view
            const belongsToCurrentView =
                (!activeThread && !message.ThreadId) ||
                (activeThread && message.ThreadId === activeThread);

           

            if (belongsToCurrentView) {
                // Ensure the message has a valid date
                if (!message.CreatedAt) {
                    message.CreatedAt = new Date().toISOString();
                }


                // Add the new message to the messages array
                setMessages(prev => {
                    const updatedMessages = [...prev, message];

                    // If we now have more than MESSAGES_PER_PAGE messages, 
                    // keep only the most recent MESSAGES_PER_PAGE messages
                    if (updatedMessages.length > MESSAGES_PER_PAGE) {
                        // Set hasMoreMessages to true since we now have more messages
                        setHasMoreMessages(true);
                        // Return only the most recent MESSAGES_PER_PAGE messages
                        return updatedMessages.slice(-MESSAGES_PER_PAGE);
                    }

                    return updatedMessages;
                });

                // Scroll to bottom after adding message
                setTimeout(() => {
                    scrollToBottom();
                }, 100);

                // Update total message count for pagination
                setTotalMessages(prevTotal => prevTotal + 1);
            }
        };

        socketRef.current.on('chat', handleNewMessage);

        return () => {
            socketRef.current.off('chat', handleNewMessage);
        };
    }, [activeThread, MESSAGES_PER_PAGE]);

    // Socket event handler for message deletion
    useEffect(() => {
        if (!socketRef.current) return;

        const handleMessageDeleted = (deletedMessage) => {
            // Handle when deletedMessage is just an ID (string or number)
            if (typeof deletedMessage !== 'object') {

                // Remove message with this ID regardless of thread
                setMessages(prev => {
                    const newMessages = prev.filter(msg => msg.Id !== deletedMessage);
                    setTotalMessages(prev => Math.max(0, prev - 1));
                    return newMessages;
                });
                return;
            }

            // For object type deletedMessage
            const messageId = deletedMessage.Id;

            const messageExists = messages.some(msg => msg.Id === messageId);

            // If the message exists in our current view, update it
            if (messageExists) {

                if (deletedMessage.Message === 'Deleted message') {
                    // Update the message to show as deleted
                    setMessages(prev => {
                        return prev.map(msg =>
                            msg.Id === messageId
                                ? { ...msg, Message: 'Deleted message', IsDeleted: true }
                                : msg
                        );
                    });
                } else {
                    // Remove the message completely
                    setMessages(prev => {
                        const newMessages = prev.filter(msg => msg.Id !== messageId);
                        setTotalMessages(prev => Math.max(0, prev - 1));
                        return newMessages;
                    });
                }
            // eslint-disable-next-line no-empty
            } else {
            }
        };

        socketRef.current.on('chat_deleted', handleMessageDeleted);

        return () => {
            socketRef.current.off('chat_deleted', handleMessageDeleted);
        };
    }, [activeThread, messages]); // Add messages to dependencies

    // Force re-render when messages change
    useEffect(() => {
    }, [messages]);

    // Add useEffect to ensure hasMoreMessages and hasMoreThreads are properly set on initial load
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
                    {/* Threads panel */}
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
                                    {/* Either show Load More OR Show Less button, not both */}
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
                                            ) : (hasMoreThreads && threads.length >= THREADS_PER_PAGE ) ? (
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

                                    {/* Thread List */}
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

                    {/* Chat content */}
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

                        {/* Messages area */}
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
                                    {/* Either show Load More OR Show Less button for messages */}
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

                                    {/* Messages */}
                                    {messages.map(message => (
                                        <div
                                            key={message.Id}
                                            className={`${styles.messageCard} ${replyingTo?.Id === message.Id ? styles.highlightedMessage : ''} ${message.IsDeleted || message.Message === 'Deleted message' ? styles.deletedMessage : ''}`}
                                        >
                                            <div className={styles.messageAvatar}>
                                                <ProfileImage
                                                    photoPath={message.User.ProfilePhoto}
                                                    userName={message.User.FirstName}
                                                />
                                            </div>
                                            <div className={styles.messageContent}>
                                                <div className={styles.messageMetadata}>
                                                    <span className={styles.userName}>
                                                        {message.User.FirstName} {message.User.LastName}
                                                    </span>
                                                    <span className={styles.messageTime}>
                                                        {formatDate(message.CreatedAt)}
                                                    </span>
                                                </div>

                                                {message.ReplyTo && (
                                                    <div className={styles.repliedMessage}>
                                                        <i className="fa-solid fa-reply"></i>
                                                        <div className={styles.replyAvatarContainer}>
                                                            <ProfileImage
                                                                photoPath={message.ReplyTo.User.ProfilePhoto}
                                                                userName={message.ReplyTo.User.FirstName}
                                                            />
                                                        </div>
                                                        <span className={styles.replyAuthor}>
                                                            {message.ReplyTo.User.FirstName}:
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

                                                {/* Only show actions if message is not deleted */}
                                                {!message.IsDeleted && message.Message !== 'Deleted message' && (
                                                    <div className={styles.messageActions}>
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => setReplyingTo(message)}
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

                                                        {/* Only show delete button if user can delete this message */}
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

                        {/* Message input */}
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



export default SubTeamChannel;
