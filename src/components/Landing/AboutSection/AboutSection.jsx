import styles from "./AboutSection.module.css";
import aboutSectionImage from "../../../assets/aboutSectionImage.png";
import rocket from "../../../assets/Icons/rocket.svg"
import idea from "../../../assets/Icons/idea.svg"
import code from "../../../assets/Icons/code.svg"
import community from "../../../assets/Icons/community.svg"

export default function AboutSection() {


  const features = [
    {
      icon: idea,
      alt: "Innovative Learning Icon",
      title: "Innovative Learning",
      description: "Cutting-edge educational methodologies combined with AI-driven insights"
    },
    {
      icon: rocket,
      alt: "Accelerated Growth Icon",
      title: "Accelerated Growth",
      description: "Fast-track your learning journey with personalized roadmaps and targeted resources"
    },
    {
      icon: community,
      alt: "Community Powered Icon",
      title: "Community Powered",
      description: "Learn alongside peers and receive guidance from industry experts"
    },
    {
      icon: code,
      alt: "Practical Application Icon",
      title: "Practical Application",
      description: "Apply your knowledge through real-world projects and interactive challenges"
    }
  ];

  return <>

    <section className={`${styles.AboutSection}`}>

      {/* AboutSectionContainer */}
      <div className={`${styles.AboutSectionContainer} specialContainer`}>


        {/* aboutectionImage */}
        <div className={`${styles.aboutectionImage} `}>
          <img src={aboutSectionImage} alt="" />
        </div>


        {/*  aboutSectionContent*/}
        <div className={`${styles.aboutSectionContent}`}>

          <h2 className={`${styles.sectionTitle}`}>About<span> BridgeX</span></h2>
          <p className={`${styles.sectionDescription}`}>BridgeX is transforming how university students learn by combining cutting-edge AI technology with proven educational methodologies. Our platform creates personalized learning experiences that adapt to each student&apos;s unique needs and goals.</p>

          {/* featuresGrid */}
          <div className={`${styles.featuresGrid} `}>

            {/* featureItem */}
            {features.map((feature, index) => (
              <div key={index} className={`${styles.featureItem}  `}>
                <img
                  src={feature.icon}
                  alt={feature.alt}
                  className={`${styles.featureIcon}`}
                />
                <h5 className={`${styles.featureTitle}`}>{feature.title}</h5>
                <p className={`${styles.featureDescription}`}>
                  {feature.description}
                </p>

              </div>
            ))}

          </div>
        </div>


      </div>

    </section>





  </>
}
