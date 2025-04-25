/* eslint-disable react/prop-types */
import styles from "./SubTeamOverview.module.css";
const baseUrl = import.meta.env.VITE_BASE_URL;

// getSocialMediaIcon
const getSocialMediaIcon = (name) => {
    const socialName = name?.toLowerCase() || 'link';
    const iconMap = {
        facebook: 'fa-facebook-f',
        twitter: 'fa-twitter',
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

export default function SubTeamOverview({ subTeamData }) {
    const stats = [
        {
            value: subTeamData.MembersCount || 0,
            label: "Members",
            icon: "/public/icons/member.svg"
        },
        {
            value: subTeamData.CreatedAt ? subTeamData.CreatedAt.substring(0, 7) : "-",
            label: "Created",
            icon: "/public/icons/time.svg"
        }
    ];

    const validMediaLinks = subTeamData.MediaLinks?.filter(link =>
        link?.Link && typeof link.Link === 'string' && link.Link.trim() !== ''
    ) || [];

    return (
        <section className={styles.subTeamOverview}>
            <div className={styles.subTeamStats}>
                <div className={styles.subTeamStatsContainer}>
                    <div className={styles.subTeamLogoWrapper}>
                        <img
                            className={styles.logo}
                            src={subTeamData.Logo ? getFullImageUrl(subTeamData.Logo) : "/public/logoPlaceholder.jpg"}
                            alt="SubTeam Logo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/public/team-placeholder.png";
                            }}
                        />
                    </div>

                    <div className={styles.statisticsWrapper}>
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

            <div className={styles.subTeamInfo}>
                <div className={styles.aboutSubTeam}>
                    <h4 className={styles.title}>{subTeamData.Name || "Sub-Team Name"}</h4>
                    <p className={styles.desc}>
                        {subTeamData.Desc || "No description available for this sub-team."}
                    </p>
                </div>

                <div className={styles.subTeamVision}>
                    <h4 className={styles.title}>Our Vision</h4>
                    <p className={styles.desc}>
                        {subTeamData.Vision || "No vision statement available for this sub-team."}
                    </p>
                </div>
            </div>
        </section>
    );
}
