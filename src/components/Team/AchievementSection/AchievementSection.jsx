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

    // Placeholder data in case achievementData is empty
    const placeholderData = [
        {
            Id: '1',
            Title: 'Sample Achievement',
            Desc: 'This is a sample achievement description',
            ImageLink: 'https://via.placeholder.com/400x300?text=No+Image'
        },
        {
            Id: '2',
            Title: 'Another Achievement',
            Desc: 'Another sample description for demonstration',
            ImageLink: 'https://via.placeholder.com/400x300?text=No+Image'
        }
    ];

    // Use the actual data if available, otherwise use placeholder
    const dataToDisplay = achievementData?.length > 0 ? achievementData : placeholderData;

    return (
        <div className={`${styles.achievementSection} `}>
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
                    {dataToDisplay.map((achievement) => (
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