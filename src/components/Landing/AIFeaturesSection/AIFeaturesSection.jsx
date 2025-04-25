import styles from "./AIFeaturesSection.module.css";
import IQ_icon from "../../../assets/Icons/aiFeaturesSectionIcons/IQ_icon.svg";
import PA_icon from "../../../assets/Icons/aiFeaturesSectionIcons/PA_icon.svg";
import SS_icon from "../../../assets/Icons/aiFeaturesSectionIcons/SS_icon.svg";
import checkBoxIcon from "../../../assets/Icons/checkBoxIcon.svg";


export default function AiFeaturesSection() {


  const features = [
    {
      icon: IQ_icon,
      title: "Instant Q&A",
      description: "Get instant answers to learning questions, helping you overcome obstacles quickly.",
      highlight: "24/7 availability"
    },
    {
      icon: SS_icon,
      title: "Smart Summaries",
      description: "Convert long videos and articles into concise, easy-to-understand key insights.",
      highlight: "Save time on research"
    },
    {
      icon: PA_icon,
      title: "Personalized Assistance",
      description: "AI that adapts to your learning style and provides customized guidance for better results.",
      highlight: "Tailored to your needs"
    }
  ];

  return <>

    {/*  aiFeaturesSection*/}
    <section className={`${styles.aiFeaturesSection}`}>

      {/* aiFeaturesContainer */}
      <div className={`${styles.aiFeaturesContainer} specialContainer`}>

        <h2 className={`${styles.title}`}>AI-Powered Learning Assistant</h2>
        <h6 className={`${styles.subtitle}`}>
          Your personal guide to enhanced learning and knowledge retention
        </h6>

        {/* aiFeaturesContent */}
        <div className={`${styles.aiFeaturesContent}`}>

          {/* cardsContainer */}
          <div className={`${styles.cardsContainer} mx-auto row w-100 `}>

            {/* card */}
            {features.map((feature, index) => (
              <div key={index} className={`${styles.card} shadow`}>

                {/* iconWrapper */}
                <div className={`${styles.iconWrapper}`}>
                  <img src={feature.icon} alt="" />
                </div>

                {/* cardInfo */}
                <div className={`${styles.cardInfo}`}>

                  <h4 className={`${styles.cardTitle}`}>{feature.title}</h4>
                  <p className={`${styles.cardDescription}`}>{feature.description}</p>

                  {/* highlightWrapper */}
                  <div className={`${styles.highlightWrapper}`}>
                    <img src={checkBoxIcon} className={`${styles.checkBoxIcon}`} />
                    <span className={`${styles.highlight}`}>{feature.highlight}</span>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <div className={`${styles.exploreLinkWrapper}`}>

            <a href="#" className={`${styles.exploreLink} `}>Explore all AI features </a>
            <i className={`${styles.arrowRight} fas fa-arrow-right-long`}></i>
          </div>

        </div>


      </div>


    </section>





  </>
}
