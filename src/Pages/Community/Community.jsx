import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import styles from "./Community.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OurTeamsSection from "../../components/Community/OurTeamsSection/OurTeamsSection";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import 'react-toastify/dist/ReactToastify.css';
import UpdateCommunityData from '../../components/Community/Roles/CommunityAdmin/UpdateCommunityData/UpdateCommunityData';
import AddNewTeam from '../../components/Community/Roles/CommunityAdmin/AddNewTeam/AddNewTeam';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
import placeholderData from './PlaceholderData';
import CommunityGallery from '../../components/Community/CommunityGallery/CommunityGallery';
import CommunityOverview from '../../components/Community/CommunityOverview/CommunityOverview';

const token = localStorage.getItem("token")
const baseUrl = import.meta.env.VITE_BASE_URL;


// Social media icon mapping
;

// fetchCommunity
const fetchCommunity = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/api/communities/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.Data;
    } catch (error) {
        throw new Error(error.response?.data?.Message || 'Failed to fetch community data');
    }
};

// Improved function to merge actual data with placeholder data
const getSafeData = (data) => {
    if (!data) return placeholderData;

    return {
        ...placeholderData,
        ...data,
        Name: data.Name || placeholderData.Name,
        Desc: data.Desc || placeholderData.Desc,
        DescShort: data.DescShort || placeholderData.DescShort,
        Vision: data.Vision || placeholderData.Vision,
        MembersCount: data.MembersCount || placeholderData.MembersCount,
        CreatedAt: data.CreatedAt || placeholderData.CreatedAt,
        Logo: data.Logo || placeholderData.Logo,
        Images: data.Images || placeholderData.Images,
        MediaLinks: data.MediaLinks || placeholderData.MediaLinks,
        Teams: data.Teams || placeholderData.Teams,
        Leader: data.Leader || { FirstName: "Admin", Email: "admin@example.com" }
    };
};

// Community
const Community = () => {



    const { communityId } = useParams();

    // Fetch community data with React Query
    const { data: communityData, isLoading, isError, error, refetch } = useQuery(
        ['community', communityId],
        () => fetchCommunity(communityId),
        {
            staleTime: Infinity,
            cacheTime: 3600000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
        }
    );






    const safeData = getSafeData(communityData);



    // Loading state
    if (isLoading) return <LoadingScreen />;

    // Error state
    if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;





    // Function to construct full image URL



    return (

        <>

            {/* Scroll to top */}
            <ScrollToTop />
            <UpdateCommunityData communityId={communityId} refetch={refetch} />
            <AddNewTeam communityId={communityId} refetch={refetch} />

            {/* communityPage */}
            <section className={`${styles.communityPage} `}>

                {/* Edit icon - only for community admin */}
                {safeData.CanModify &&
                    <i
                        data-bs-toggle="modal"
                        data-bs-target="#updateCommunityModal"
                        className={`${styles.editIon} fa-solid fa-pen-to-square`}
                    ></i>
                }

                {/* Community Gallery */}
                <CommunityGallery safeData={safeData} communityId={communityId} refetch={refetch} />

                {/* Community Container */}
                <div className={`${styles.communityContainer} specialContainer`}>

                    <CommunityOverview safeData={safeData} />

                    <div className="d-flex justify-content-center">

                        {safeData.CanModify &&

                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#addTeamModal"
                                className={styles.addTeamButton}
                            >
                                Add New Team
                            </button>
                        }

                    </div>
                    <OurTeamsSection canModify={safeData?.CanModify} communityId={communityId} teams={safeData.Teams} />
                </div>


            </section>
        </>
    );
};

export default Community;



