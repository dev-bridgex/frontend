
import { Logo } from "../Logo/Logo";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {

  const footerData = [
    {
      title: <Logo />,
      content: [
        'Empowering student teams with AI-powered learning and collaboration tools.'
      ]
    },
    {
      title: 'Quick Links',
      content: [
        { text: 'Home', link: '/' },
        { text: 'About', link: '/about' },
        { text: 'How it Works', link: '/how-it-works' },
        { text: 'AI Assistant', link: '/ai-assistant' }
      ]
    },
    {
      title: 'Resources',
      content: [
        { text: 'Documentation', link: '/docs' },
        { text: 'Tutorials', link: '/tutorials' },
        { text: 'Blog', link: '/blog' },
        { text: 'Support', link: '/support' }
      ]
    },
    {
      title: 'Contact',
      content: [
        { text: 'info@bridgex.edu', icon: 'fas fa-envelope' },
        { text: '+1 (555) 123-4567', icon: 'fas fa-phone' },
        { text: '123 Learning St, Education City', icon: 'fas fa-location-dot' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,         
        staggerChildren: 0.15,
        delayChildren: 0.2     
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20,                  
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

  const socialVariants = {
    hidden: { 
      scale: 0.5,
      opacity: 0 
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,      
        damping: 12,        
        duration: 0.5       
      }
    }
  };

  const hoverScale = {
    scale: 1.05,
    transition: {
      duration: 0.2,         
      ease: "easeInOut"
    }
  };

  const hoverMove = {
    x: 8,
    transition: {
      duration: 0.2,        
      ease: "easeInOut"
    }
  };

  return (
    <motion.footer 
      className={styles.footer}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true,        
        amount: 0.1        
      }}
      variants={containerVariants}
    >
      <div className={styles.glowEffect}></div>
      <div className={`${styles.footerContainer} specialContainer`}>
        <motion.div 
          className={styles.footerContent}
          variants={containerVariants}
        >
          {footerData.map((section, index) => (
            <motion.div 
              key={index} 
              className={styles.footerItem}
              variants={itemVariants}
            >
              <motion.div 
                className={styles.sectionHeader}
                whileHover={hoverScale}
              >
                <h3 className={styles.footerTitle}>{section.title}</h3>
                <div className={styles.titleAccent}></div>
              </motion.div>
              
              {index === 0 ? (
                <motion.p 
                  className={styles.footerDescription}
                  variants={itemVariants}
                >
                  {section.content[0]}
                </motion.p>
              ) : index === 3 ? (
                <motion.ul 
                  className={styles.contactList}
                  variants={containerVariants}
                >
                  {section.content.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className={styles.contactItem}
                      variants={itemVariants}
                      whileHover={hoverMove}
                    >
                      <div className={styles.iconWrapper}>
                        <i className={`${item.icon} ${styles.contactIcon}`}></i>
                      </div>
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ul 
                  className={styles.linksList}
                  variants={containerVariants}
                >
                  {section.content.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className={styles.linkItem}
                      variants={itemVariants}
                      whileHover={hoverMove}
                    >
                      <Link to={item.link}>
                        <span className={styles.linkText}>{item.text}</span>
                        <i className="fas fa-chevron-right"></i>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={styles.footerBottom}
          variants={containerVariants}
        >
          <motion.div 
            className={styles.socialLinks}
            variants={containerVariants}
          >
            {['facebook-f', 'twitter', 'linkedin-in', 'instagram'].map((platform) => (
              <motion.a 
                key={platform} 
                href="#" 
                className={styles.socialLink}
                variants={socialVariants}
                whileHover={{ 
                  scale: 1.15,
                  transition: { 
                    type: "spring", 
                    stiffness: 300,
                    duration: 0.4
                  }
                }}
              >
                <div className={styles.socialIconWrapper}>
                  <i className={`fab fa-${platform}`}></i>
                </div>
              </motion.a>
            ))}
          </motion.div>
          
          <div className={styles.divider}></div>
          
          <motion.div 
            className={styles.copyright}
            variants={itemVariants}
          >
            <motion.span 
              className={styles.copyrightText}
              variants={itemVariants}
            >
              © 2025 BridgeX
            </motion.span>
            <span className={styles.separator}>|</span>
            <motion.span 
              className={styles.rightsText}
              variants={itemVariants}
            >
              All rights reserved
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}






