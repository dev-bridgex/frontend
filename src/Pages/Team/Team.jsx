import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import styles from "./Team.module.css";
import member from "../../assets/communityImage/icons/member.svg";
import time from "../../assets/communityImage/icons/time.svg";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateTeamData from '../../components/Team/UpdateTeamData/UpdateTeamData';
import AchievementSection from './../../components/Team/AchievementSection/AchievementSection';
import OurSubTeamSection from '../../components/Team/OurSubTeamSection/OurSubTeamSection';
import AddSubTeam from '../../components/Team/AddSubTeam/AddSubTeam';
import TeamGallery from '../../components/Team/TeamGallery/TeamGallery';


const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

// Social media icon mapping
const getSocialMediaIcon = (name) => {
    const socialName = name?.toLowerCase() || 'link';
    const iconMap = {
        facebook: 'fa-facebook-f',
        x: 'fa-twitter',
        twitter: 'fa-twitter',
        linkedin: 'fa-linkedin-in',
        instagram: 'fa-instagram',
        youtube: 'fa-youtube',
        github: 'fa-github',
        tiktok: 'fa-tiktok',
        whatsapp: 'fa-whatsapp',
        telegram: 'fa-telegram',
        reddit: 'fa-reddit',
        pinterest: 'fa-pinterest',
        snapchat: 'fa-snapchat',
        discord: 'fa-discord',
        twitch: 'fa-twitch',
        vimeo: 'fa-vimeo',
        skype: 'fa-skype',
        link: 'fa-link'
    };
    return iconMap[socialName] || iconMap.link;
};

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

// Improved function to merge actual data with placeholder data
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

    const stats = [
        { value: safeData.MembersCount, label: "Members", icon: member },
        { value: safeData.CreatedAt.substring(0, 7), label: "Created", icon: time },
    ];

    if (isLoading) return <LoadingScreen />;

    if (isError) {
        toast.error(error.message, {
            position: "top-center",
            autoClose: 5000,
        });
        return (
            <div className={styles.error}>
                Error: {error.message}
                <ToastContainer />
            </div>
        );
    }

    const getFullImageUrl = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) return imgPath;
        return `${baseUrl}/api${imgPath}`;
    };

    const validImages = safeData.Images.filter(img => img?.Link);
    const hasImages = validImages.length > 0;

    const sliderImages = hasImages
        ? validImages.map(img => ({
            title: safeData.Name,
            description: safeData.DescShort,
            image: getFullImageUrl(img.Link)
        }))
        : [{
            title: safeData.Name,
            description: safeData.DescShort,
            image: "/public/placeholder.webp"
        }];

    const validMediaLinks = safeData.MediaLinks.filter(link =>
        link && link.Link && typeof link.Link === 'string' && link.Link.trim() !== ''
    );
    const hasMediaLinks = validMediaLinks.length > 0;

    return (
        <>
            <AddSubTeam teamId={teamId} communityId={communityId} />
            <ScrollToTop />
            <ToastContainer />
            <UpdateTeamData teamId={teamId} communityId={communityId} />

            <section className={`${styles.teamPage}`}>
                {safeData.CanModify &&
                    <i
                        data-bs-toggle="modal"
                        data-bs-target="#updateTeamModal"
                        className={`${styles.editIon} fa-solid fa-pen-to-square`}
                    ></i>
                }

                <TeamGallery safeData={safeData} />

                {/* Team Container */}
                <div className={`${styles.teamContainer} specialContainer`}>
                    <div className={`${styles.teamHeader}`}>
                        <div className={styles.teamStats}>
                            <div className={styles.teamStatsContainer}>
                                <img
                                    className={styles.teamLogo}
                                    src={safeData.Logo ? getFullImageUrl(safeData.Logo) : "/public/team-placeholder.png"}
                                    alt="Team Logo"
                                />

                                <div className={styles.statisticsWrapper}>
                                    {stats.map((stat, index) => (
                                        <div key={index} className={styles.statistic}>
                                            <img className={styles.icon} src={stat.icon} alt="" />
                                            <p className={styles.value}>{stat.value}</p>
                                            <p>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {hasMediaLinks && (
                                    <div className={styles.socialMedia}>
                                        <div className={styles.socialIcons}>
                                            {validMediaLinks.map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.Link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.socialLink}
                                                    title={social.Name || 'Social Link'}
                                                >
                                                    <i className={`fab ${getSocialMediaIcon(social.Name)}`}></i>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${styles.teamOverview}`}>
                            <div className={styles.aboutTeam}>
                                <h4 className={styles.title}>{safeData.Name}</h4>
                                <p className={styles.desc}>{safeData.Desc}</p>
                            </div>

                            <div className={styles.teamVision}>
                                <h4 className={styles.title}>Our Vision</h4>
                                <p className={styles.desc}>{safeData.Vision}</p>
                            </div>
                        </div>
                    </div>

                    {safeData.CanModify && (
                        <div className={styles.actionButtonContainer}>
                            <button
                                className={`${styles.actionButton} ButtonStyle`}
                                data-bs-toggle="modal"
                                data-bs-target="#addSubTeamModal"
                            >
                                Add New Sub Team
                            </button>
                        </div>
                    )}

                    <OurSubTeamSection subTeams={safeData.SubTeams} communityId={communityId} teamId={teamId} refetch={refetch} canModify={safeData.CanModify} />
                    <AchievementSection achievementData={teamData?.Achievements} />
                </div>
            </section>
        </>
    );
};

export default Team;