
import { Logo } from "../Logo/Logo";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

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

  return (
    <footer className={styles.footer}>
      <div className={styles.glowEffect}></div>
      <div className={`${styles.footerContainer} specialContainer`}>
        <div className={styles.footerContent}>
          {footerData.map((section, index) => (
            <div key={index} className={styles.footerItem}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.footerTitle}>{section.title}</h3>
                <div className={styles.titleAccent}></div>
              </div>
              
              {index === 0 ? (
                <p className={styles.footerDescription}>{section.content[0]}</p>
              ) : index === 3 ? (
                <ul className={styles.contactList}>
                  {section.content.map((item, idx) => (
                    <li key={idx} className={styles.contactItem}>
                      <div className={styles.iconWrapper}>
                        <i className={`${item.icon} ${styles.contactIcon}`}></i>
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className={styles.linksList}>
                  {section.content.map((item, idx) => (
                    <li key={idx} className={styles.linkItem}>
                      <Link to={item.link}>
                        <span className={styles.linkText}>{item.text}</span>
                        <i className="fas fa-chevron-right"></i>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.socialLinks}>
            {['facebook-f', 'twitter', 'linkedin-in', 'instagram'].map((platform) => (
              <a key={platform} href="#" className={styles.socialLink}>
                <div className={styles.socialIconWrapper}>
                  <i className={`fab fa-${platform}`}></i>
                </div>
              </a>
            ))}
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.copyright}>
            <span className={styles.copyrightText}>© 2025 BridgeX</span>
            <span className={styles.separator}>|</span>
            <span className={styles.rightsText}>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


