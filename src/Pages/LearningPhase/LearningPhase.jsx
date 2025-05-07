/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import VideosList from "../../components/LearningPhase/VideosList/VideosList";
import styles from "./LearningPhase.module.css";
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
import { useParams } from 'react-router';
import UpdateNameAndDesc from '../../components/LearningPhase/UpdateNameAndDesc/UpdateNameAndDesc';
import AddNewSection from '../../components/LearningPhase/AddNewSection/AddNewSection';
import AIChatModal from '../../components/LearningPhase/AIChatModal/AIChatModal';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Fetch learning phase data from API
const fetchLearningPhase = async ({ communityId, teamId, subTeamId }) => {
    const token = localStorage.getItem('token');

    try {
        const { data } = await axios.get(
            `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return data?.Data;
    } catch (error) {
        throw new Error('Failed to fetch learning phase data');
    }
};

export default function LearningPhase() {
    const { communityId, teamId, subTeamId } = useParams();
    const [showAiChat, setShowAiChat] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery(
        ['learningPhase', communityId, teamId, subTeamId],
        () => fetchLearningPhase({ communityId, teamId, subTeamId }),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
        }
    );


    // Calculate total duration in seconds
    const totalSeconds = data?.Sections?.reduce((sum, section) => {
        return sum + section.Videos.reduce((secSum, video) => {
            return secSum + parseFloat(video.Duration || 0);
        }, 0);
    }, 0) || 0;

    const totalVideos = data?.Sections?.reduce((sum, section) => {
        return sum + section.Videos.length;
    }, 0) || 0;

    // Format total duration to show hours, minutes and seconds
    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours} ${hours === 1 ? 'hour' : 'hours'} `;
        }
        if (minutes > 0) {
            formattedTime += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} `;
        }
        formattedTime += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;

        return formattedTime;
    };

    const formattedTotalDuration = formatDuration(totalSeconds);

    if (isLoading) return <LoadingScreen />;
    if (isError) return <ErrorDisplay error={error} />;

    return (
        <>
            <UpdateNameAndDesc communityId={communityId} teamId={teamId} subTeamId={subTeamId} initialData={data} refetch={refetch} />
            <AddNewSection communityId={communityId} teamId={teamId} subTeamId={subTeamId} refetch={refetch} />

            {/* AI Chat Floating Button */}
            <button
                className={styles.aiChatButton}
                onClick={() => setShowAiChat(true)}
                title="Open AI Assistant"
            >
                <i className="fa-solid fa-robot"></i>
                <span>AI Assistant</span>
            </button>

            {/* LearningPhase */}
            <section className={`${styles.learingPhasePage}`}>

                {/* learningPhaseContainer */}
                <div className={`${styles.learningPhaseContainer} specialContainer`}>

                    {/* learningPhaseHeader */}
                    <div className={`${styles.learningPhaseHeader} `}>

                        {/* headerContainer */}
                        <div className={`${styles.headerContainer} `}>

                            <h6 className={`${styles.CurrentPage}`}>
                                <span>Courses</span>
                                <img src="/icons/smallArrowRight.svg" alt="" />
                                <span>{data?.TiTle || 'Web Development Fundamentals'}</span>
                            </h6>
                            <h2 className={`${styles.title}`}>{data?.TiTle || 'Web Development Fundamentals'}</h2>

                            {/* Add course description */}
                            {data?.Desc && (
                                <p className={`${styles.courseDescription}`}>
                                    {data.Desc}
                                </p>
                            )}

                            {/* courseDetails */}
                            <div className={`${styles.courseDetails}`}>
                                {/* courseDuration */}
                                <div className={`${styles.courseDuration}`}>
                                    <img src="/icons/hour.svg" alt="" />
                                    <span>{formattedTotalDuration} total</span>
                                </div>

                                {/* contentCount */}
                                <div className={`${styles.contentCount}`}>
                                    <img src="/icons/totalVideoIcon.svg" alt="" />
                                    <span>{totalVideos} {totalVideos === 1 ? 'video' : 'videos'}</span>
                                </div>
                            </div>
                        </div>

                        {data?.CanModify &&
                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#updateNameAndDescModal"
                                className={`${styles.editButton}`}
                                title="Edit learning details"
                            >
                                <span className={styles.editButtonText}>Edit Info</span>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        }

                    </div>

                    {data?.CanModify && (
                        <div className={styles.addSectionWrapper}>
                            <button
                                className={styles.addSectionButton}
                                data-bs-toggle="modal"
                                data-bs-target="#addNewSectionModal"
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span>Add New Section</span>
                            </button>
                        </div>
                    )}

                    <VideosList CanModify={data?.CanModify} sections={data?.Sections || []} communityId={communityId} teamId={teamId} subTeamId={subTeamId} refetch={refetch} />

                </div>
            </section>

            {/* AI Chat Modal */}
            <AIChatModal isOpen={showAiChat} onClose={() => setShowAiChat(false)} communityId={communityId} teamId={teamId} subTeamId={subTeamId} />
        </>
    );
}
