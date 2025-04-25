
import { Link } from 'react-router-dom';
import styles from './JoinUs.module.css';

export default function JoinUs() {
    return (
        <section className={`${styles.joinUsSection}`}>
            <div className={`${styles.joinUsContainer}`}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Ready to Join Our Team?</h2>
                    <p className={styles.desc}>
                        Be part of an innovative team that&lsquo;s shaping the future of technology. 
                        Join us in creating impactful solutions and growing together.
                    </p>
                    <button className={styles.joinNowButton}>
                        <Link to={"/signIn"}>
                            Apply Now
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
                        </Link>
                    </button>
                </div>
                <div className={styles.decorativeElements}>
                    <div className={styles.circle}></div>
                    <div className={styles.square}></div>
                </div>
            </div>
        </section>
    );
}
