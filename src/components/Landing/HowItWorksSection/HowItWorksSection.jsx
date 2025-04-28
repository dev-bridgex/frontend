import styles from "./HowItWorksSection.module.css";
import book from "../../../assets/Icons/howItWorkSectionIcons/book.svg";
import brain from "../../../assets/Icons/howItWorkSectionIcons/brain.svg";
import chat from "../../../assets/Icons/howItWorkSectionIcons/chat.svg";
import user from "../../../assets/Icons/howItWorkSectionIcons/user.svg";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: {
      y: -20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const stepVariants = {
    hidden: {
      y: 30,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className={styles.HowItWorksSection}>

      <motion.div
        className={`${styles.howItWorkContainer} `}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="specialContainer ">
          {/* Add decorative elements */}
          <div className={styles.decorativeElements}>
            <motion.div
              className={styles.floatingSquare}
              animate={{
                y: [-20, 0, -20],
                rotate: [0, 45, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={styles.floatingCircle}
              animate={{
                y: [0, -30, 0],
                x: [-10, 10, -10]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <motion.h2
            className={styles.title}
            variants={titleVariants}
          >
            How BridgeX Works
          </motion.h2>

          <motion.h6
            className={styles.subtitle}
            variants={titleVariants}
          >
            A simple, structured approach to collaborative learning
          </motion.h6>

          <div>
            <motion.div
              className={styles.horizontalLine}
              variants={lineVariants}
            />

            <div className={styles.stepsContainer}>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={styles.stepItem}
                  variants={stepVariants}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    className={styles.iconWrapper}

                  >
                    <img src={step.icon} alt={step.title} className={styles.icon} />
                  </motion.div>

                  <h5 className={styles.stepTitle}>{step.title}</h5>
                  <p className={styles.stepDescription}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className={styles.catButtonWrapper}
            variants={buttonVariants}
          >
            <motion.button
              className={`${styles.ctaButton} ButtonStyle`}
              whileHover="hover"
              variants={buttonVariants}
            >
              Start Your Journey <i className="fas fa-arrow-right"></i>
            </motion.button>
          </motion.div>
        </div>

      </motion.div>

    </section>
  );
}


