/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LearningPhaseSection.module.css';
import { toast } from 'react-toastify';

export default function LearningPhaseSection({
    subTeamId,
    communityId,
    teamId,
    learningPhaseTitle,
    learningPhaseDesc,
    isMember,
    canModify
}) {
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: "fa-solid fa-video",
            title: "Video Tutorials",
            description: "Access comprehensive video lessons crafted by industry experts"
        },
        {
            icon: "fa-solid fa-book",
            title: "Resources",
            description: "Download supplementary materials to enhance your learning experience"
        }
    ];

    // Default placeholder values if data is null
    const title = learningPhaseTitle || "Learning Phase";
    const description = learningPhaseDesc || "Embark on a structured learning journey with our comprehensive curriculum. Master new skills through expert-led content and hands-on practice.";

    // Handle view learning phase button click
    const handleViewLearningPhase = (e) => {
        e.preventDefault();

        if (isMember || canModify) {
            // Navigate to learning phase page
            navigate(`/communities/community/${communityId}/teams/${teamId}/subteams/${subTeamId}/LearningPhase`);
        } else {
            // Show error message
            toast.error(
                <div className={styles.accessDeniedToast}>
                    <i className="fa-solid fa-lock"></i>
                    <div>
                        <strong>Access Restricted</strong>
                        <p>You need to create an account and join this team to access the learning materials.</p>
                    </div>
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    };

    return (
        <>
            <section ref={sectionRef} className={`${styles.learningPhaseSection} ${styles.fadeIn}`}>
                <div className={`${styles.learingPhaseContainer}`}>
                    <div className={`${styles.LearningPhaseIntro}`}>
                        <div className={styles.titleContainer}>
                            <h3 className={`${styles.title}`}>{title}</h3>
                            <div className={styles.titleUnderline}></div>
                        </div>
                        <p className={`${styles.desc}`}>
                            {description}
                        </p>
                        <div className={styles.learnMore}>
                            <button
                                className={`${styles.viewButton} ButtonStyle`}
                                onClick={handleViewLearningPhase}
                            >
                                View Learning Phase
                                <svg
                                    className={styles.arrow}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 12H19M19 12L12 5M19 12L12 19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={`${styles.LearningPhaseFeatures}`}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`${styles.feature}`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <div className={`${styles.logoWrapper}`}>
                                    <i className={feature.icon}></i>
                                </div>

                                <div className={`${styles.featureInfo}`}>
                                    <h5 className={`${styles.title}`}>{feature.title}</h5>
                                    <p className={`${styles.desc}`}>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
