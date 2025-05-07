/* eslint-disable react/prop-types */
import styles from "./CommunityGallery.module.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Placeholder data in case safeData is not available
const placeholderData = {
    Name: "Community Name",
    DescShort: "Short description about the community",
    Images: [
        {
            Link: "/placeholder.webp"
        }
    ]
};


// CommunityGallery
export default function CommunityGallery({ safeData, refetch, communityId }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteImage = async (imageId) => {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            const token = localStorage.getItem("token");
            const url = `${baseUrl}/api/communities/${communityId}/${imageId}`;

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

    // Use safeData or fallback to placeholderData
    const data = safeData || placeholderData;
    const images = data?.Images || placeholderData.Images;


    // Function to construct full image URL
    const getFullImageUrl = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) return imgPath;
        return `${baseUrl}/api${imgPath}`;
    };

    // Filter valid images
    const validImages = images.filter(img => img?.Link);
    const hasImages = validImages.length > 0;

    // Prepare slider images data
    const sliderImages = hasImages
        ? validImages.map(img => ({
            title: data?.Name || placeholderData.Name,
            description: data?.DescShort || placeholderData.DescShort,
            image: getFullImageUrl(img.Link)
        }))
        : [{
            title: data?.Name || placeholderData.Name,
            description: data?.DescShort || placeholderData.DescShort,
            image: "/placeholder.webp"
        }];

    return (
        <section className={styles.communityGallery}>
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
                        loop={sliderImages.length > 1}
                        autoplay={sliderImages.length > 1 ? {
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        } : false}
                    >
                        {sliderImages.map((item, index) => (
                            <SwiperSlide key={index} className={styles.swiperSlide}>
                                <div className={styles.sliderContent}>
                                    <h4 className={styles.title}>{item.title}</h4>
                                    <p className={styles.description}>{item.description}</p>
                                </div>

                                <div className={styles.imageContainer}>
                                    <img
                                        src={item.image}
                                        alt={`Slide ${index + 1}`}
                                        className={styles.swipperImage}
                                    />
                                    {/* Show delete button only for actual images (not placeholder) */}
                                    {validImages[index]?.Id && safeData?.CanModify && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteImage(validImages[index].Id)}
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={`custom-pagination ${styles.customPagination}`}></div>
                </div>
            </div>
        </section>
    );
}
