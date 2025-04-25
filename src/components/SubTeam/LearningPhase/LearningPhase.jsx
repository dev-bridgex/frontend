import styles from "./LearningPhase.module.css";

export default function LearningPhase() {

    const features = [
        {
            icon: "/public/icons/video.svg",
            title: "Video Tutorials",
            description: "Learn from expert-led video content"
        },
        {
            icon: "/public/icons/book.svg",
            title: "Resources",
            description: "Learn from expert-led video content"
        }

    ];

    return (
        <>
            {/* learningPhaseSection */}
            <section className={`${styles.learningPhaseSection}`}>

                {/* learingPhaseContainer */}
                <div className={`${styles.learingPhaseContainer}`}>

                    {/* LearningPhaseIntro */}
                    <div className={`${styles.LearningPhaseIntro}`}>
                        <h3 className={`${styles.title}`}>Learing Phase</h3>
                        <p className={`${styles.desc}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quas alias suscipit, ab quibusdam debitis?</p>
                        <button className={`${styles.viewButton} ButtonStyle`}>View Learning Phase</button>
                    </div>

                    {/* LearningPhaseFeatures */}
                    <div className={`${styles.LearningPhaseFeatures}`}>

                        {features.map((feature, index) => (
                            // feature
                            <div key={index} className={`${styles.feature}`}>
                                {/* logoWrapper */}
                                <div className={`${styles.logoWrapper}`}>
                                    <img src={feature.icon} alt="" />
                                </div>

                                {/* featureInfo */}
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