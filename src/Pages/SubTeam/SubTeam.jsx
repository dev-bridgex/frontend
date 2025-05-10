import { useQuery } from 'react-query';
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SubTeam.module.css";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import SubTeamGallery from "../../components/SubTeam/SubTeamGallery/SubTeamGallery";
import SubTeamOverview from "../../components/SubTeam/SubTeamOverview/SubTeamOverview";
import JoinUs from "../../components/SubTeam/JoinUs/JoinUs";
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import 'react-toastify/dist/ReactToastify.css';
import UpdateSubTeamData from '../../components/SubTeam/UpdateSubTeamData/UpdateSubTeamData';
import ChannelsSection from '../../components/SubTeam/ChannelsSection/ChannelsSection';
import LearningPhaseSection from "../../components/SubTeam/LearningPhaseSection/LearningPhaseSection";
import { toast } from 'react-toastify';
import EditSubTeam from '../../components/SubTeam/EditSubTeam/EditSubTeam';
import { useState } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Placeholder data
const placeholderData = {
    Id: "default-subteam-id",
    Name: "Sub-Team Name",
    Desc: "This is a default sub-team description.",
    DescShort: "Short description about the sub-team",
    Vision: "Our vision is to achieve excellence in our field.",
    Logo: null,
    Images: [],
    MediaLinks: [],
    Channels: [],
    Leaders: [],
    CreatedAt: new Date().toISOString(),
    CanModify: false,
    JoinLink: null
};

export default function SubTeam() {

    // state managment
    const navigate = useNavigate();
    const { communityId, teamId, subTeamId } = useParams();
    const token = localStorage.getItem("token");
    const [selectedSubTeamData, setSelectedSubTeamData] = useState(null);

    // Fetch sub-team data
    const fetchSubTeam = async () => {
        try {
            const { data } = await axios.get(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSelectedSubTeamData(data?.Data);
            return data?.Data;
        } catch (error) {
            throw new Error(error.response?.data?.Message || 'Failed to fetch sub-team data');
        }
    };

    // Merge actual data with placeholders
    const getSafeData = (data) => {
        if (!data) return placeholderData;

        return {
            ...placeholderData,
            ...data,
            Name: data.Name || placeholderData.Name,
            Desc: data.Desc || placeholderData.Desc,
            DescShort: data.DescShort || placeholderData.DescShort,
            Vision: data.Vision || placeholderData.Vision,
            Logo: data.Logo || placeholderData.Logo,
            Images: data.Images || placeholderData.Images,
            MediaLinks: data.MediaLinks || placeholderData.MediaLinks,
            Channels: data.Channels || placeholderData.Channels,
            Leaders: data.Leaders || placeholderData.Leaders,
            CreatedAt: data.CreatedAt || placeholderData.CreatedAt,
            JoinLink: data.JoinLink || placeholderData.JoinLink
        };
    };

    const handleLeaveSubTeam = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/leave`,
                {},
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Successfully left the sub-team!', {
                    position: "top-center",
                    autoClose: 2000
                });
                navigate(-1);
            }
        } catch (error) {
            toast.error(error.response?.data?.Message || 'Failed to leave sub-team', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const { data: subTeamData, isLoading, refetch } = useQuery(
        ['subTeam', communityId, teamId, subTeamId],
        fetchSubTeam,
        {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        }
    );




    const safeData = getSafeData(subTeamData);


    if (isLoading) return <LoadingScreen />;

    return (
        <>
            <ScrollToTop />
            <UpdateSubTeamData refetch={refetch} communityId={communityId} teamId={teamId} subTeamId={subTeamId} />

            {safeData?.CanModify && selectedSubTeamData && (
                <EditSubTeam
                    communityId={communityId}
                    teamId={teamId}
                    subTeamId={subTeamId}
                    refetch={refetch}
                    initialData={{
                        name: selectedSubTeamData.Name,
                        joinLink: selectedSubTeamData.JoinLink
                    }}
                />
            )}

            <section className={`${styles.subTeamPage}`}>
                {/* Action buttons container - only shown if user has modification rights */}
                {safeData?.CanModify &&
                    <div className={styles.actionButtons}>
                        {/* Update SubTeam Information */}
                        <button
                            data-bs-toggle="modal"
                            data-bs-target="#updateSubTeamModal"
                            className={styles.actionButton}
                            title="Update SubTeam Information"
                        >
                            <i className={`fa-solid fa-pen-to-square ${styles.buttonIcon}`}></i>
                            <span className={styles.tooltip}>Update SubTeam Information</span>
                        </button>

                        {/* Edit Sub Team */}
                        <button
                            data-bs-toggle="modal"
                            data-bs-target="#editSubTeamModal"
                            className={styles.actionButton}
                            title="Edit Sub Team"
                        >
                            <i className={`fa-solid fa-file-pen ${styles.buttonIcon}`}></i>
                            <span className={styles.tooltip}>Edit Sub Team</span>
                        </button>

                        {/* Manage Members Button */}
                        <button
                            onClick={() => navigate(`/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/manageMembers`)}
                            className={styles.actionButton}
                            title="Manage Members"
                        >
                            <i className={`fa-solid fa-users-gear ${styles.buttonIcon}`}></i>
                            <span className={styles.tooltip}>Manage Members</span>
                        </button>
                    </div>



                }

                {safeData.IsMember &&

                    <div className={styles.actionButtons}>
                        <button
                            onClick={handleLeaveSubTeam}
                            className={`${styles.actionButton} ${styles.leaveButton}`}
                            title="Leave SubTeam"
                        >
                            <i className={`fa-solid fa-right-from-bracket ${styles.buttonIcon}`}></i>
                            <span className={styles.tooltip}>Leave SubTeam</span>
                        </button>
                    </div>

                }

                {/* subTeamGallery */}
                <SubTeamGallery
                    images={safeData.Images}
                    name={safeData.Name}
                    descShort={safeData.DescShort}
                    communityId={communityId}
                    teamId={teamId}
                    subTeamId={subTeamId}
                    refetch={refetch}
                    CanModify={safeData.CanModify}
                />

                <div className={`${styles.subTeamContainer} specialContainer `}>
                    <SubTeamOverview subTeamData={safeData} />

                    <>


                        <ChannelsSection communityId={communityId}
                            teamId={teamId}
                            subteamId={subTeamId}
                            CanModify={safeData.CanModify}
                            isMember={safeData.IsMember}
                        />
                        <LearningPhaseSection
                            subTeamId={subTeamId}
                            communityId={communityId}
                            teamId={teamId}
                            learningPhaseTitle={safeData.LearningPhaseTitle}
                            learningPhaseDesc={safeData.LearningPhaseDesc}
                            isMember={safeData.IsMember}
                            canModify={safeData.CanModify}
                        />
                    </>


                    {!token && <JoinUs joinLink={safeData?.JoinLink} />}

                </div>
            </section>
        </>
    );
}
