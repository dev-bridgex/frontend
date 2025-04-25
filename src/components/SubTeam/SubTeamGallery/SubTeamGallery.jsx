/* eslint-disable react/prop-types */
import styles from "./SubTeamGallery.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to get full image URL
const getFullImageUrl = (imgPath, baseUrl) => {
    if (!imgPath) return '/public/placeholder.webp';
    if (imgPath.startsWith('http')) return imgPath;
    return `${baseUrl}/api${imgPath}`;
};

export default function SubTeamGallery({
    images,
    name,
    descShort,
    communityId,
    teamId,
    subTeamId,
    refetch,
    CanModify
}) {


    const [isDeleting, setIsDeleting] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    // handleDeleteImage
    const handleDeleteImage = async (imageId) => {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            const token = localStorage.getItem("token");
            const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/${imageId}`;

            await axios.delete(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "accept": "*/*"
                }
            });

            toast.success("Image deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            refetch();
        } catch (err) {
            toast.error(err.response?.data?.Message || "Failed to delete image", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // Use placeholder if no images exist
    const sliderImages = images?.length > 0
        ? images.map(img => ({
            id: img.Id,
            title: name,
            description: descShort,
            image: getFullImageUrl(img.Link, baseUrl)
        }))
        : [{
            id: null,
            title: name || "Sub-Team Name",
            description: descShort || "Short description about the sub-team",
            image: "/public/placeholder.webp"
        }];

    return (
        <section className={`${styles.subTeamGallery}`}>
            <div className={styles.galleryContainer}>
                <div className={styles.swiperWrapper}>
                    <Swiper
                        className={styles.swiperContainer}
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            dynamicBullets: false,
                            el: '.custom-pagination',
                            type: 'bullets',
                        }}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                    >
                        {sliderImages.map((item, index) => (
                            <SwiperSlide key={index} className={styles.swiperSlide}>
                                <div className={`${styles.imageContainer}`}>
                                    <img
                                        src={item.image}
                                        alt={`Slide ${index + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/public/placeholder.webp";
                                        }}
                                        className={`${styles.swipperImage}`}
                                    />
                                    {/* Show delete button only for actual images (not placeholder) */}
                                    {item.id && CanModify && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteImage(item.id)}
                                            disabled={isDeleting}
                                            aria-label="Delete image"
                                        >
                                            {isDeleting ? (
                                                <span className={styles.deleteSpinner}></span>
                                            ) : (
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className={styles.sliderContent}>
                                    <h4 className={styles.title}>{item.title}</h4>
                                    <p className={styles.description}>{item.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={`custom-pagination ${styles.customPagination}`}></div>
                </div>
            </div>
        </section>
    );
}
