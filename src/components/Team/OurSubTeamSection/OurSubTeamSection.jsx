/* eslint-disable react/prop-types */
import styles from "./OurSubTeamSection.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) {
        return imgPath;
    }
    return `${baseUrl}/api${imgPath}`;
};

export default function OurSubTeamSection({ subTeams, communityId, teamId }) {
    const handleJoinSubTeam = async (subTeamId) => {
        try {
            if (!token) {
                toast.error('Please login to join a sub-team', {
                    position: "top-center"
                });
                return;
            }


            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/join`,
                {},
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Successfully joined the sub-team!', { position: "top-center" });
            } else {
                toast.error(response.data.message || 'Failed to join sub-team', { position: "top-center" });
            }
        } catch (error) {

            if (error.response) {
                toast.error(error.response.data.Message || 'Failed to join sub-team', { position: "top-center" });
            } else {
                toast.error('An error occurred while joining the sub-team', { position: "top-center" });
            }
        }
    };

    const processedSubTeams = subTeams.map(subTeam => ({
        Id: subTeam.Id || "default-subteam-id",
        Name: subTeam.Name || "Unnamed Sub-Team",
        Logo: subTeam.Logo || null,
        DescShort: subTeam.DescShort || "No description available for this sub-team",
        MembersCount: subTeam.MembersCount || 0
    }));

    return (
        <section className={`${styles.ourSubTeamsPage} `}>
            <div className={`${styles.subTeamsContainer} specialContainer`}>
                <div className={`${styles.subTeamsHeader}`}>
                    <h3 className={styles.title}>Our Sub-Teams</h3>
                </div>

                {processedSubTeams.length > 0 ? (
                    <div className={`${styles.subTeamCards}  `}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            pagination={{
                                clickable: true,
                                el: `.${styles.customPagination}`,
                                type: 'bullets',
                            }}
                        >
                            {processedSubTeams.map((subTeam) => (
                                <SwiperSlide key={subTeam.Id}>
                                    <div className={`${styles.subTeamCardWrapper} `}>
                                        <div className={styles.imageContainer}>
                                            <img
                                                src={getFullImageUrl(subTeam.Logo)}
                                                alt={subTeam.Name}
                                                className={styles.subTeamCardImage}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/public/subteam-placeholder.png";
                                                }}
                                            />
                                        </div>
                                        <div className={styles.subTeamCardContent}>
                                            <div className={styles.subTeamContentHeader}>
                                                <h4 className={styles.subTeamCardTitle}>{subTeam.Name}</h4>
                                                <p className={styles.numberOfMember}>
                                                    {subTeam.MembersCount} {subTeam.MembersCount === 1 ? 'member' : 'members'}
                                                </p>
                                            </div>
                                            <p className={styles.subTeamCardDescription}>
                                                {subTeam.DescShort}
                                            </p>
                                            <div className={styles.cardFooter}>
                                                <Link to={`/communities/community/${communityId}/teams/${teamId}/subteams/${subTeam.Id}`} className={styles.learnMore}>
                                                    Learn more <i className="fas fa-arrow-right"></i>
                                                </Link>

                                                {token &&

                                                    <button
                                                        className={styles.joinButton}
                                                        onClick={() => handleJoinSubTeam(subTeam.Id)}
                                                    >
                                                        Join Team
                                                    </button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className={styles.customPagination}></div>
                    </div>
                ) : (
                    <div className={styles.noSubTeamsMessage}>
                        <p>This team doesn&lsquo;t have any sub-teams yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}