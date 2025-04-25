import styles from "./HowItWorksSection.module.css";
import book from "../../../assets/Icons/howItWorkSectionIcons/book.svg";
import brain from "../../../assets/Icons/howItWorkSectionIcons/brain.svg";
import chat from "../../../assets/Icons/howItWorkSectionIcons/chat.svg";
import user from "../../../assets/Icons/howItWorkSectionIcons/user.svg";

export default function HowItWorksSection() {

  const steps = [
    {
      icon: user,
      title: 'Sign Up & Join a Team',
      description: 'Select a student team that aligns with your interests and goals.',
    },
    {
      icon: book,
      title: 'Choose Your Learning Phase',
      description: 'Engage with structured educational content tailored to your needs.',
    },
    {
      icon: chat,
      title: 'AI-Powered Learning',
      description: 'Ask questions, get summaries, and receive personalized guidance.',
    },
    {
      icon: brain,
      title: 'Collaborate & Engage',
      description: 'Interact with team members through blogs and discussions.',
    }
  ];



  return <>

    {/* HowItWorksSection */}
    <section className={`${styles.HowItWorksSection}`}>

      {/* howItWorkContainer */}
      <div className={`${styles.howItWorkContainer}  specialContainer`}>

        <h2 className={`${styles.title}`}>How BridgeX Works</h2>
        <h6 className={`${styles.subtitle}`}>A simple, structured approach to collaborative learning</h6>

        {/* stepsContainer */}
        <div >

          <div className={`${styles.horizontalLine} `} />

          <div className={`${styles.stepsContainer}   `}>
            {steps.map((step, index) => (

              // stepItem
              <div key={index} className={`${styles.stepItem}   `}>

                <div className={`${styles.iconWrapper}`}>
                  <img src={step.icon} alt={step.title} className={`${styles.icon}`} />
                </div>

                <h5 className={`${styles.stepTitle}`}>{step.title}</h5>
                <p className={`${styles.stepDescription}`}>{step.description}</p>
              </div>
            ))}
          </div>

        </div>

        {/* catButtonWrapper */}
        <div className={`${styles.catButtonWrapper}`}>
          <button className={`${styles.ctaButton} ButtonStyle`}>Start Your Journey <i className="fas fa-arrow-right"></i></button>
        </div>

      </div>

    </section>





  </>
}
