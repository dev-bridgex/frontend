/* eslint-disable react/prop-types */
import styles from "./CommunityOverview.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

// getSocialMediaIcon
const getSocialMediaIcon = (name) => {
    const socialName = name?.toLowerCase() || 'link';
    const iconMap = {
        facebook: 'fa-facebook-f',
        twitter: 'fa-twitter',
        x: 'fa-twitter',
        linkedin: 'fa-linkedin-in',
        instagram: 'fa-instagram',
        youtube: 'fa-youtube',
        link: 'fa-link'
    };
    return iconMap[socialName] || iconMap.link;
};

// getFullImageUrl
const getFullImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    return `${baseUrl}/api${imgPath}`;
};

export default function CommunityOverview({ safeData }) {
    const stats = [
        {
            value: safeData.MembersCount || 0,
            label: "Members",
            icon: "/public/icons/member.svg"
        },
        {
            value: safeData.CreatedAt ? safeData.CreatedAt.substring(0, 7) : "-",
            label: "Created",
            icon: "/public/icons/time.svg"
        }
    ];

    const validMediaLinks = safeData.MediaLinks?.filter(link =>
        link?.Link && typeof link.Link === 'string' && link.Link.trim() !== ''
    ) || [];

    return (
        <section className={`${styles.communityOverview} `}>
            <div className={`${styles.communityStats} `}>
                <div className={styles.communityStatsContainer}>
                    <div className={`${styles.communityLogoWrapper}  `}>
                        <img
                            className={styles.logo}
                            src={safeData.Logo ? getFullImageUrl(safeData.Logo) : "/public/logoPlaceholder.jpg"}
                            alt="Community Logo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/public/team-placeholder.png";
                            }}
                        />
                    </div>

                    <div className={`${styles.statisticsWrapper}`}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.statistic}>
                                <img className={styles.icon} src={stat.icon} alt="" />
                                <p className={styles.value}>{stat.value}</p>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {validMediaLinks.length > 0 && (
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

            <div className={styles.communityInfo}>
                <div className={styles.aboutCommunity}>
                    <div className={styles.sectionHeader}>
                        <i className="fas fa-info-circle"></i>
                        <h4 className={styles.title}>
                            {safeData.Name || "Community Name"}
                        </h4>
                    </div>
                    <div className={styles.descriptionBox}>
                        <p className={styles.desc}>
                            {safeData.Desc || "No description available for this community."}
                        </p>
                        <div className={styles.decorativeLine}></div>
                    </div>
                </div>

                <div className={styles.communityVision}>
                    <div className={styles.visionHeader}>
                        <div className={styles.iconWrapper}>
                            <i className="fas fa-lightbulb"></i>
                        </div>
                        <h4 className={styles.title}>Our Vision</h4>
                    </div>
                    <div className={styles.visionContent}>
                        <div className={styles.quoteIcon}>
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <p className={styles.desc}>
                            {safeData.Vision || "No vision statement available for this community."}
                        </p>
                        <div className={styles.quoteIcon}>
                            <i className="fas fa-quote-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
