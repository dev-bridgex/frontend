/* eslint-disable react/prop-types */
import styles from "./VideoPlayerModal.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const VideoPlayerModal = ({ communityId, teamId, subTeamId, sectionId, videoId, videoName, onClose }) => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video/${videoId}`;

                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'video/mp4',
                        'Range': 'bytes=0-'
                    },
                    responseType: 'blob'
                });

                if (!response.data || response.data.size === 0) {
                    throw new Error("Received empty video data");
                }

                const contentType = response.headers['content-type'] || 'video/mp4';
                const videoBlob = new Blob([response.data], { type: contentType });
                const videoUrl = URL.createObjectURL(videoBlob);

                setVideoUrl(videoUrl);
                setLoading(false);

            } catch (err) {
                setError(err.message || "Failed to load video. Please try again.");
                setLoading(false);
            }
        };

        fetchVideo();

        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [communityId, teamId, subTeamId, sectionId, videoId]);

    const handleClose = () => {
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.videoModal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.modalTitle}>{videoName}</h5>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close video player"
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.videoPlayerWrapper}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.simpleLoader}>
                                <div className={styles.playButtonLoader}>
                                    <div className={styles.triangle}></div>
                                    <div className={styles.loadingCircle}></div>
                                </div>
                                <p className={styles.loadingText}>Loading video...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className={styles.errorMessage}>
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                            <button
                                className={styles.retryButton}
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            className={styles.videoPlayer}
                            autoPlay
                            playsInline
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerModal;
