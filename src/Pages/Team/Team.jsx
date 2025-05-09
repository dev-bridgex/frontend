import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import styles from "./Team.module.css";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateTeamData from '../../components/Team/UpdateTeamData/UpdateTeamData';
import AchievementSection from './../../components/Team/AchievementSection/AchievementSection';
import OurSubTeamSection from '../../components/Team/OurSubTeamSection/OurSubTeamSection';
import AddSubTeam from '../../components/Team/AddSubTeam/AddSubTeam';
import TeamGallery from '../../components/Team/TeamGallery/TeamGallery';
import TeamOverview from '../../components/Team/TeamOverview/TeamOverview';
import TeamChannelSection from '../../components/Team/TeamChannelSection/TeamChannelSection';
import TeamLeadersSection from '../../components/Team/TeamLeadersSection/TeamLeadersSection';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Placeholder data
const placeholderData = {
    Name: "Team Name",
    Desc: "This is a default team description. The admin hasn't added a description yet.",
    DescShort: "Short description about the team",
    Vision: "Our vision is to achieve excellence in our field.",
    MembersCount: "0",
    CreatedAt: new Date().toISOString(),
    Logo: null,
    Images: [],
    MediaLinks: [],
    SubTeams: []
};

// fetchTeam
const fetchTeam = async (communityId, teamId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/communities/${communityId}/teams/${teamId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.Data;
    } catch (error) {
        throw new Error(error.response?.data?.Message || 'Failed to fetch team data');
    }
};

const getSafeData = (data) => {
    if (!data) return placeholderData;

    const getValue = (value, placeholder) =>
        value !== null && value !== undefined ? value : placeholder;

    const processedSubTeams = data.SubTeams && data.SubTeams.length > 0
        ? data.SubTeams.map(subTeam => ({
            Id: subTeam.Id || "default-subteam-id",
            Name: getValue(subTeam.Name, "Sub-Team Name"),
            DescShort: getValue(subTeam.DescShort, "Short description about the sub-team"),
            Logo: subTeam.Logo || null,
            MembersCount: subTeam.MembersCount || 0
        }))
        : placeholderData.SubTeams;

    return {
        ...placeholderData,
        ...data,
        Name: getValue(data.Name, placeholderData.Name),
        Desc: getValue(data.Desc, placeholderData.Desc),
        DescShort: getValue(data.DescShort, placeholderData.DescShort),
        Vision: getValue(data.Vision, placeholderData.Vision),
        MembersCount: data.MembersCount || placeholderData.MembersCount,
        CreatedAt: data.CreatedAt || placeholderData.CreatedAt,
        Logo: data.Logo || placeholderData.Logo,
        Images: data.Images || placeholderData.Images,
        MediaLinks: data.MediaLinks || placeholderData.MediaLinks,
        SubTeams: processedSubTeams,
        Leaders: data.Leaders || [],
        Leader: data.Leader || {
            FirstName: "Admin",
            Email: "admin@example.com",
            ProfilePhoto: null
        }
    };
};

const Team = () => {
    const { teamId, communityId } = useParams();

    const { data: teamData, isLoading, isError, error, refetch } = useQuery(
        ['team', communityId, teamId],
        () => fetchTeam(communityId, teamId),
        {
            staleTime: Infinity,
            cacheTime: 3600000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
        }
    );

    const safeData = getSafeData(teamData);

    if (isLoading) return <LoadingScreen />;

    if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;

    return (
        <>
            <AddSubTeam teamId={teamId} communityId={communityId} refetch={refetch} />
            <ScrollToTop />
            <ToastContainer />
            <UpdateTeamData teamId={teamId} communityId={communityId} refetch={refetch} />

            <section className={styles.teamPage}>
                {safeData.CanModify &&
                    <i
                        data-bs-toggle="modal"
                        data-bs-target="#updateTeamModal"
                        className={`${styles.editIon} fa-solid fa-pen-to-square`}
                    ></i>
                }

                <TeamGallery safeData={safeData} refetch={refetch} communityId={communityId} teamId={teamId} />

                <div className={`${styles.teamContainer} specialContainer`}>
                    <TeamOverview
                        safeData={safeData}
                    />


                    {safeData.CanModify && (
                        <div className="d-flex justify-content-center">
                            <button
                                className={`${styles.addSubTeamButton} ButtonStyle`}
                                data-bs-toggle="modal"
                                data-bs-target="#addSubTeamModal"
                            >
                                Add New Sub Team
                            </button>
                        </div>
                    )}

                    <OurSubTeamSection subTeams={safeData.SubTeams} communityId={communityId} teamId={teamId} refetch={refetch} canModify={safeData.CanModify} />
                    <TeamChannelSection communityId={communityId} teamId={teamId} CanModify={safeData.CanModify} isMember={safeData.IsMember} />
                    <AchievementSection achievementData={teamData?.Achievements} />
                    <TeamLeadersSection leaders={safeData.Leaders} />

                </div>
            </section>
        </>
    );
};

export default Team;


