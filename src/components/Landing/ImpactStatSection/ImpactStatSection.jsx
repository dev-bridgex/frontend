import styles from "./ImpactStatSection.module.css";
import learningPath from '../../../assets/Icons/ImpactStatsSectionImage/learningPath.svg';
import activeCommuntites from '../../../assets/Icons/ImpactStatsSectionImage/activeCommuntites.svg';
import successStories from '../../../assets/Icons/ImpactStatsSectionImage/successStories.svg';
import totalMember from '../../../assets/Icons/ImpactStatsSectionImage/totalMember.svg';
import { motion } from "framer-motion";

export default function ImpactStatSection() {
  const statsData = [
    { icon: activeCommuntites, value: '50+', label: 'Active Communities' },
    { icon: totalMember, value: '5,000+', label: 'Total Members' },
    { icon: learningPath, value: '200+', label: 'Learning Paths' },
    { icon: successStories, value: '10,000+', label: 'Success Stories' }
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

  const decorativeVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const statItemVariants = {
    hidden: { 
      y: 30,
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

  return (
    <section className={`${styles.ImpactStatSection}`}>
      {/* Decorative Elements */}
      <motion.div 
        className={styles.decorativeElements}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={decorativeVariants}
      >
        <motion.div 
          className={styles.growingCircle}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className={styles.floatingDiamond}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div 
          className={styles.dots}
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>

      <motion.div 
        className={`${styles.ImpactStatContainer} specialContainer`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className={`${styles.statsContainer} row w-100 mx-auto gap-md-0 gap-5`}>
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              className={`${styles.statItem} col-md-3 col-5  mx-auto`}
              variants={statItemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className={`${styles.icon}`}>
                <img className="w-100" src={stat.icon} alt="" />
              </div>
              <motion.h3 
                className={`${styles.value}`}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: 0.3 + (index * 0.1)
                  }
                }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.h3>
              <p className={`${styles.label}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}


