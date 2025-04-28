import { motion } from "framer-motion";
import styles from "./AboutSection.module.css";
import aboutSectionImage from "../../../assets/aboutSectionImage.png";
import rocket from "../../../assets/Icons/rocket.svg"
import idea from "../../../assets/Icons/idea.svg"
import code from "../../../assets/Icons/code.svg"
import community from "../../../assets/Icons/community.svg"

export default function AboutSection() {
  // Animation variants
  const imageVariants = {
    hidden: { 
      x: -100, 
      opacity: 0 
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 2,
        bounce: 0.3
      }
    }
  };


  const titleVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1
      }
    }
  };

  const descriptionVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.2
      }
    }
  };

  const featureVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.5,
        bounce: 0.35
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

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

  return (
    <section className={`${styles.AboutSection}`}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.dots}></div>
        <div className={styles.dots}></div>
      </div>

      <div className={`${styles.AboutSectionContainer} specialContainer`}>
        <motion.div 
          className={`${styles.aboutectionImage}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={imageVariants}
        >
          <img src={aboutSectionImage} alt="" />
        </motion.div>

        <div className={`${styles.aboutSectionContent}`}>
          <motion.h2 
            className={`${styles.sectionTitle}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={titleVariants}
          >
            About<span> BridgeX</span>
          </motion.h2>

          <motion.p 
            className={`${styles.sectionDescription}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={descriptionVariants}
          >
            BridgeX is transforming how university students learn by combining cutting-edge AI technology with proven educational methodologies. Our platform creates personalized learning experiences that adapt to each student&apos;s unique needs and goals.
          </motion.p>

          <motion.div 
            className={`${styles.featuresGrid}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`${styles.featureItem}`}
                variants={featureVariants}
                custom={index}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <img
                  src={feature.icon}
                  alt={feature.alt}
                  className={`${styles.featureIcon}`}
                />
                <h5 className={`${styles.featureTitle}`}>{feature.title}</h5>
                <p className={`${styles.featureDescription}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}









