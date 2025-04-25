
import { Link } from 'react-router-dom';
import styles from './JoinUs.module.css';

export default function JoinUs() {

    return <>

        {/* joinUsSetion */}
        <section className={`${styles.joinUsSetion} `}>

            {/* joinUsContainer */}
            <div className={`${styles.joinUsContainer}`}>

                <h2 className={`${styles.title}`}>Ready to Join Our Team?</h2>
                <p className={`${styles.desc}`}>Be part of an innovative team that&apos;s shaping the future of technology. Join us in creating impactful solutions and growing together.</p>

                {/* joinNowButton */}
                <button className={`${styles.joinNowButton}`}>
                    <Link to={"/signIn"}>
                        Apply Now
                        <i className='fas fa-arrow-right'> </i>
                    </Link>
                </button>
            </div>

        </section>


    </>
}
