
import VideosList from "../../components/LearningPhase/VideosList/VideosList";
import styles from "./LearningPhase.module.css";

export default function LearningPhase() {

    return <>

        {/* LearningPhase */}
        <section className={`${styles.learingPhasePage}`}>

            {/* learningPhaseContainer */}
            <div className={`${styles.learningPhaseContainer} specialContainer`}>

                {/* learningPhaseHeader */}
                <div className={`${styles.learningPhaseHeader}`}>

                    <h6 className={`${styles.CurrentPage}`}><span>Courses</span> <img src="/public/icons/smallArrowRight.svg" alt="" /><span>web development</span></h6>
                    <h2 className={`${styles.title}`}>Web Development Fundamentals</h2>

                    {/* courseDetails */}
                    <div className={`${styles.courseDetails} `}>

                        {/* courseDuration */}
                        <div className={`${styles.courseDuration}`}>
                            <img src="/public/icons/hour.svg" alt="" />
                            <span>12 hours total</span>
                        </div>

                        {/* contentCount */}
                        <div className={`${styles.contentCount}`}>
                            <img src="/public/icons/totalVideoIcon.svg" alt="" />
                            <span> 24 videos</span>
                        </div>

                    </div>
                </div>


                <VideosList />

            </div>

        </section>
    </>
}
