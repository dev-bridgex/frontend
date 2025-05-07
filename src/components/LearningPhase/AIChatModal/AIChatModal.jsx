/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './AIChatModal.module.css';

export default function AIChatModal({ isOpen, onClose, communityId, teamId, subTeamId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const messagesEndRef = useRef(null);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const ITEMS_PER_PAGE = 14; 
    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch chat history when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchChatHistory();
        }
    }, [isOpen]);

    // Fetch chat history
    const fetchChatHistory = async (page = 1) => {
        setIsLoadingHistory(true);
        setCurrentPage(page);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/chat?page=${page}&limit=${ITEMS_PER_PAGE}`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.Success) {

                const totalItems = response.data.Data.TotalCount || response.data.Data.Data.length;
                const calculatedTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
                setTotalPages(calculatedTotalPages);
                
                if (response.data.Data.Data && response.data.Data.Data.length > 0) {
                    setChatHistory([...response.data.Data.Data].reverse());
                    
                    const historyMessages = [];
                    
                    [...response.data.Data.Data].reverse().forEach(item => {
                        historyMessages.push({
                            type: 'user',
                            content: item.Message
                        });
                        
                        historyMessages.push({
                            type: 'ai',
                            content: item.Response.response,
                            sources: item.Response.sources
                        });
                    });
                    
                    setMessages(historyMessages);
                } else {
                    setChatHistory([]);
                    if (page === 1) {
                        setMessages([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Load a specific conversation from history
    const loadConversation = (conversation) => {
        const conversationMessages = [
            { type: 'user', content: conversation.Message },
            { 
                type: 'ai', 
                content: conversation.Response.response,
                sources: conversation.Response.sources
            }
        ];
        setMessages(conversationMessages);
        setShowHistory(false);
    };

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Add user message to chat
        const userMessage = { type: 'user', content: newMessage };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/chat`,
                { Message: newMessage },
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.Success) {
                // Add AI response to chat
                const aiResponse = {
                    type: 'ai',
                    content: response.data.Data.response,
                    sources: response.data.Data.sources
                };
                setMessages(prev => [...prev, aiResponse]);
                
                // Update chat history
                fetchChatHistory();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message
            setMessages(prev => [...prev, {
                type: 'error',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle history view
    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3>AI Learning Assistant</h3>
                    <div className={styles.headerActions}>
                        <button 
                            className={styles.historyButton} 
                            onClick={toggleHistory}
                            title={showHistory ? "Close History" : "Show Chat History"}
                        >
                            <i className="fa-solid fa-history"></i>
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>

                <div className={styles.chatLayout}>
                    {/* Chat History Sidebar */}
                    {showHistory && (
                        <div className={styles.historySidebar}>
                            <div className={styles.historyHeader}>
                                <h4>Chat History</h4>
                            </div>
                            <div className={styles.historyList}>
                                {isLoadingHistory ? (
                                    <div className={styles.loadingHistory}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Loading history...</p>
                                    </div>
                                ) : chatHistory.length === 0 ? (
                                    <p className={styles.noHistory}>No previous conversations found.</p>
                                ) : (
                                    chatHistory.map((conversation, index) => (
                                        <div 
                                            key={index} 
                                            className={styles.historyItem}
                                            onClick={() => loadConversation(conversation)}
                                        >
                                            <div className={styles.historyItemContent}>
                                                <p className={styles.historyQuestion}>
                                                    <i className="fa-solid fa-user"></i>
                                                    {conversation.Message.length > 30 
                                                        ? `${conversation.Message.substring(0, 30)}...` 
                                                        : conversation.Message}
                                                </p>
                                                <p className={styles.historyAnswer}>
                                                    <i className="fa-solid fa-robot"></i>
                                                    {conversation.Response.response.length > 40 
                                                        ? `${conversation.Response.response.substring(0, 40)}...` 
                                                        : conversation.Response.response}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {chatHistory.length > 0 && (
                                <div className={styles.paginationControls}>
                                    <button 
                                        className={`${styles.pageButton} ${currentPage <= 1 ? styles.disabled : ''}`}
                                        disabled={currentPage <= 1}
                                        onClick={() => fetchChatHistory(currentPage - 1)}
                                        title="Previous Page"
                                    >
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    
                                    <div className={styles.pageNumbers}>
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNum = index + 1;
                                            if (
                                                pageNum === 1 || 
                                                pageNum === totalPages || 
                                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                                                        onClick={() => fetchChatHistory(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                (pageNum === currentPage - 2 && currentPage > 3) || 
                                                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                                            ) {
                                                return <span key={pageNum} className={styles.pageDots}>...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    
                                    <button 
                                        className={`${styles.pageButton} ${currentPage >= totalPages ? styles.disabled : ''}`}
                                        disabled={currentPage >= totalPages}
                                        onClick={() => fetchChatHistory(currentPage + 1)}
                                        title="Next Page"
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main Chat Area */}
                    <div className={styles.chatContainer}>
                        {isLoadingHistory && messages.length === 0 ? (
                            <div className={styles.loadingHistory}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Loading chat history...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className={styles.emptyChat}>
                                <div className={styles.aiWelcome}>
                                    <i className="fa-solid fa-robot"></i>
                                    <h4>How can I help you learn today?</h4>
                                    <p>Ask me anything about your learning materials, and I&apos;ll provide answers based on your course content.</p>
                                </div>
                                <div className={styles.suggestedQuestions}>
                                    <p>Try asking:</p>
                                    <button onClick={() => setNewMessage("Explain the key concepts in this course")}>
                                        Explain the key concepts in this course
                                    </button>
                                    <button onClick={() => setNewMessage("How does AI work?")}>
                                        How does AI work?
                                    </button>
                                    <button onClick={() => setNewMessage("Summarize the main points of the learning materials")}>
                                        Summarize the main points
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.messagesContainer}>
                                {messages.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className={`${styles.message} ${
                                            message.type === 'user' 
                                                ? styles.userMessage 
                                                : message.type === 'error' 
                                                    ? styles.errorMessage 
                                                    : styles.aiMessage
                                        }`}
                                    >
                                        {message.type === 'user' ? (
                                            <>
                                                <div className={styles.messageContent}>
                                                    <p>{message.content}</p>
                                                </div>
                                                <div className={styles.userAvatar}>
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                            </>
                                        ) : message.type === 'error' ? (
                                            <>
                                                <div className={styles.aiAvatar}>
                                                    <i className="fa-solid fa-robot"></i>
                                                </div>
                                                <div className={styles.messageContent}>
                                                    <p>{message.content}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.aiAvatar}>
                                                    <i className="fa-solid fa-robot"></i>
                                                </div>
                                                <div className={styles.messageContent}>
                                                    <p>{message.content}</p>
                                                    
                                                    {message.sources && message.sources.length > 0 && (
                                                        <div className={styles.sources}>
                                                            <p className={styles.sourcesTitle}>Sources:</p>
                                                            <div className={styles.sourcesList}>
                                                                {message.sources.map((source, idx) => (
                                                                    <div key={idx} className={styles.sourceItem}>
                                                                        <span className={styles.sourceNumber}>{source.doc_num}</span>
                                                                        <div className={styles.sourceContent}>
                                                                            <p className={styles.sourceText}>{source.text.length > 150 ? `${source.text.substring(0, 150)}...` : source.text}</p>
                                                                            <p className={styles.sourceMetadata}>
                                                                                {source.metadata.document_name} - Page {source.metadata.page_num}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                                
                                {isLoading && (
                                    <div className={`${styles.message} ${styles.aiMessage}`}>
                                        <div className={styles.aiAvatar}>
                                            <i className="fa-solid fa-robot"></i>
                                        </div>
                                        <div className={styles.messageContent}>
                                            <div className={styles.typingIndicator}>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <form className={styles.inputContainer} onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your question here..."
                        disabled={isLoading || isLoadingHistory}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || isLoadingHistory || !newMessage.trim()}
                        className={!newMessage.trim() || isLoading || isLoadingHistory ? styles.disabledButton : ''}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
}








