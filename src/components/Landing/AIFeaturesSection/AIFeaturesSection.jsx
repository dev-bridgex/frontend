import styles from "./AIFeaturesSection.module.css";
import IQ_icon from "../../../assets/Icons/aiFeaturesSectionIcons/IQ_icon.svg";
import PA_icon from "../../../assets/Icons/aiFeaturesSectionIcons/PA_icon.svg";
import SS_icon from "../../../assets/Icons/aiFeaturesSectionIcons/SS_icon.svg";
import checkBoxIcon from "../../../assets/Icons/checkBoxIcon.svg";
import { motion } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  const cardVariants = {
    hidden: { 
      x: -30,
      opacity: 0 
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`${styles.aiFeaturesSection}`}>
      {/* Enhanced Decorative Elements */}
      <motion.div 
        className={styles.decorativeElements}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Hexagon Grid */}
        <div className={styles.hexagonGrid} />

        {/* Circuit Lines */}
        <div className={styles.circuitLines} />

        {/* Floating Particles */}
        <div className={styles.particles}>
          <motion.div 
            className={styles.particle}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={styles.particle}
            animate={{
              y: [20, -20, 20],
              x: [10, -10, 10],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={styles.particle}
            animate={{
              y: [-15, 15, -15],
              x: [-15, 15, -15],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Neural Network Nodes */}
        <div className={styles.neuralNodes}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.node}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Glowing Orb */}
        <motion.div 
          className={styles.glowingOrb}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Binary Code Rain */}
        <div className={styles.binaryRain}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.5}s` }}>
              {Math.random().toString(2).substr(2, 8)}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className={`${styles.aiFeaturesContainer} specialContainer`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 
          className={`${styles.title}`}
          variants={titleVariants}
        >
          AI-Powered Learning Assistant
        </motion.h2>
        <motion.h6 
          className={`${styles.subtitle}`}
          variants={titleVariants}
        >
          Your personal guide to enhanced learning and knowledge retention
        </motion.h6>

        <div className={`${styles.aiFeaturesContent}`}>
          <div className={`${styles.cardsContainer} mx-auto row w-100`}>
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className={`${styles.card} shadow`}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className={`${styles.iconWrapper}`}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <img src={feature.icon} alt="" />
                </motion.div>

                <div className={`${styles.cardInfo}`}>
                  <h4 className={`${styles.cardTitle}`}>{feature.title}</h4>
                  <p className={`${styles.cardDescription}`}>{feature.description}</p>

                  <motion.div 
                    className={`${styles.highlightWrapper} `}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <img src={checkBoxIcon} className={`${styles.checkBoxIcon}`} />
                    <span className={`${styles.highlight}`}>{feature.highlight}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className={`${styles.exploreLinkWrapper}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: {
                delay: 0.8,
                duration: 0.5
              }
            }}
            viewport={{ once: true }}
            whileHover={{
              x: 5,
              transition: { duration: 0.2 }
            }}
          >
            <a href="#" className={`${styles.exploreLink}`}>
              Explore all AI features
            </a>
            <i className={`${styles.arrowRight} fas fa-arrow-right-long`}></i>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}


