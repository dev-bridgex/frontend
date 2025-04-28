import { motion } from 'framer-motion';
import styles from './JoinUsSection.module.css';

export default function JoinUsSection() {
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

  return (
    <section className={styles.JoinUsSection}>
      <div className={`${styles.mainContainer}`}>

        {/* Neural Network Background */}
        <div className={`${styles.neuralBackground}`}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.neuralNode}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Connecting Lines */}
          <div className={styles.lines}></div>
        </div>

        {/* Glowing Orbs */}
        <motion.div
          className={styles.glowOrb1}
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
        <motion.div
          className={styles.glowOrb2}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={`${styles.joinUsContainer} specialContainer d-flex flex-column align-items-center`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className={styles.JoinUsTitle}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Join BridgeX & Start Learning Today!
          </motion.h1>

          <motion.h6
            className={styles.JoinUsDescription}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover structured learning, AI-powered assistance, and interactive collaboration—all in one platform.
          </motion.h6>

          <motion.button
            className={`${styles.JoinUsButton} ButtonStyle`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now!
            <motion.i
              className="fas fa-arrow-right-long ms-2"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>

      </div>


    </section>
  );
}








