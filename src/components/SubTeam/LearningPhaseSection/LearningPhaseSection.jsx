/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./LearningPhaseSection.module.css";
import { useEffect, useRef } from 'react';

export default function LearningPhaseSection({ subTeamId, communityId, teamId }) {
    const sectionRef = useRef(null);

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

    return (
        <>
            <section ref={sectionRef} className={`${styles.learningPhaseSection} ${styles.fadeIn}`}>
                <div className={`${styles.learingPhaseContainer}`}>
                    <div className={`${styles.LearningPhaseIntro}`}>
                        <div className={styles.titleContainer}>
                            <h3 className={`${styles.title}`}>Learning Phase</h3>
                            <div className={styles.titleUnderline}></div>
                        </div>
                        <p className={`${styles.desc}`}>
                            Embark on a structured learning journey with our comprehensive curriculum.
                            Master new skills through expert-led content and hands-on practice.
                        </p>
                        <Link to={`/communities/community/${communityId}/teams/${teamId}/subteams/${subTeamId}/LearningPhase`} className={styles.learnMore}>
                            <button className={`${styles.viewButton} ButtonStyle`}>
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
                        </Link>
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
