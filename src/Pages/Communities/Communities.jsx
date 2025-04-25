import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from "react-router-dom";
import axios from 'axios';
import styles from "./Communities.module.css";
import EditCommunity from "../../components/Communities/Roles/SuperAdmin/EditCommunity/EditCommunity";
import CreateCommunity from "../../components/Communities/Roles/SuperAdmin/CreateCommunity/CreateCommunity";
import LoadingScreen from './../../components/LoadingScreen/LoadingScreen';
import { jwtDecode } from "jwt-decode";
import communityLogo from "../../assets/communityImage/communityLogo.png";
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Fetch communities data from API
const fetchCommunities = async () => {
    try {
        const { data } = await axios.get(`${baseUrl}/api/communities`);
        return data?.Data?.Data;
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        throw new Error('Failed to fetch communities data');
    }
};

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) {
        return imgPath;
    }
    return `${baseUrl}/api${imgPath}`;
};

// function to extract user role from JWT token
const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.payload.IsSuperAdmin;
    } catch (error) {
        return error;
    }
};

export default function Communities() {

    // State management
    const userRole = getUserRole();
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);

    // Fetch communities data with React Query
    const { data: communities, isLoading, isError, error, refetch } = useQuery('communities', fetchCommunities, {
        staleTime: Infinity,
        cacheTime: 3600000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    });



    // Handle edit button click
    const handleEditClick = (communityId) => {
        setSelectedCommunityId(communityId);
    };

    // Loading state
    if (isLoading) return <LoadingScreen />;


    // Error state
    if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;


    return (
        <>

            {/* Only render these components for super admin */}
            {userRole && <CreateCommunity refetch={refetch} />}
            {userRole && <EditCommunity communityId={selectedCommunityId} refetch={refetch} />}

            {/* Main communities section */}
            <section className={`${styles.communitiesPage}`}>
                <div className={`${styles.communitiesContainer} specialContainer`}>
                    {/* Header section */}
                    <div className={`${styles.communitiesHeader}`}>
                        <h2 className={`${styles.title}`}>Featured Communities</h2>
                        <p className={`${styles.subtitle}`}>
                            Join innovative student-led communities and work on exciting real-world projects.
                        </p>
                    </div>

                    {/* New Community button - only for super admin */}
                    {userRole && (
                        <div className={`${styles.addCommunityBtnWrapper}`}>
                            <button
                                className={`${styles.addCommunityBtn} ButtonStyle`}
                                data-bs-toggle="modal"
                                data-bs-target="#createCommunityModal"
                            >
                                New Community
                            </button>
                        </div>
                    )}

                    {/* Communities cards grid */}
                    <div className={`${styles.communityCards}`}>
                        <div className={`${styles.cardsContainer} row mx-auto w-100 g-2`}>
                            {communities?.map((community) => (
                                <div key={community.Id} className={`${styles.card} p-2 col-lg-4 col-md-6 mx-auto col-sm-9 col-10`}>
                                    <div className={`${styles.cardWrapper}`}>

                                        <div className={`${styles.cardImageContainer}`}>
                                            <img
                                                src={community.Logo ? getFullImageUrl(community.Logo) : communityLogo}
                                                alt={community.Name}
                                                className={`${styles.cardImage} `}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = communityLogo; // Fallback image
                                                }}
                                            />
                                        </div>

                                        {/* Community details */}
                                        <div className={`${styles.cardContent}`}>
                                            <div className={`${styles.contentHeader}`}>
                                                <h4 className={`${styles.cardTitle}`}>{community.Name}</h4>
                                                <p className={`${styles.numberOfMember}`}>
                                                    {community.MembersCount} member{community.MembersCount !== 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            <p className={`${styles.cardDescription}`}>
                                                {community.DescShort || 'No description available'}
                                            </p>

                                            <div className={`${styles.cardFooter}`}>
                                                {/* Link to community details */}
                                                <Link
                                                    to={`community/${community.Id}`}
                                                    className={`${styles.learnMore}`}
                                                >
                                                    Learn more <i className="fas fa-arrow-right"></i>
                                                </Link>

                                                {/* Edit icon - only for super admin */}
                                                {userRole && (
                                                    <i
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editCommunityModal"
                                                        className={`${styles.editIon} fa-solid fa-pen-to-square`}
                                                        onClick={() => handleEditClick(community.Id)}
                                                    ></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
