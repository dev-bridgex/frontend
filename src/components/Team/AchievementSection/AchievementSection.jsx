/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './AchievementSection.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) {
        return imgPath;
    }
    return `${baseUrl}/api${imgPath}`;
};

const AchievementSection = ({ achievementData }) => {
    if (!achievementData?.length) {
        return (
            <div className={styles.achievementSection}>
                <h2 className={styles.sectionTitle}>Team Achievements</h2>
                <div className={styles.noDataContainer}>
                    <div className={styles.noDataContent}>
                        <svg className={styles.noDataIcon} viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                            <path d="M12 12c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 8.58c0-2.5-3.97-3.58-6-3.58s-6 1.08-6 3.58V18h12v-1.42z"/>
                        </svg>
                        <p className={styles.noDataText}>No achievements found</p>
                        <p className={styles.noDataSubText}>This team hasn&apos;t added any achievements yet</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.achievementSection}`}>
            <h2 className={styles.sectionTitle}>Team Achievements</h2>

            <div className={`${styles.sliderContainer}`}>
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
                        renderBullet: function (index, className) {
                            return '<span class="' + className + '"></span>';
                        }
                    }}
                >
                    {achievementData.map((achievement) => (
                        <SwiperSlide key={achievement.Id}>
                            <div className={styles.card}>
                                <img
                                    src={achievement.ImageLink ? getFullImageUrl(achievement.ImageLink) : '/placeholder.webp'}
                                    alt={achievement.Title}
                                    className={styles.cardImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.webp';
                                    }}
                                />
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{achievement.Title || 'Untitled Achievement'}</h3>
                                    <p className={styles.cardDescription}>
                                        {achievement.Desc || 'No description available'}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className={`${styles.customPagination}`} style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}></div>
            </div>
        </div>
    );
};

export default AchievementSection;
