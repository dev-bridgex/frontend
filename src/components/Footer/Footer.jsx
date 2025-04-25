
import { Logo } from "../Logo/Logo";
import styles from "./Footer.module.css";
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
      content: ['Home', 'About', 'How it Works', 'AI Assistant']
    },
    {
      title: 'Resources',
      content: ['Documentation', 'Tutorials', 'Blog', 'Support']
    },
    {
      title: 'Contact',
      content: [
        'Email: info@bridgex.edu',
        'Phone: +1 (555) 123-4567',
        'Address: 123 Learning St, Education City'
      ]
    }
  ];

  return <>

    {/* footer */}
    <footer className={`${styles.footer}`}>

      {/* footerContainer */}
      <div className={`${styles.footerContainer} `}>

        {/* footerContent */}
        <div className={`${styles.footerContent} `}>

          {/* footerItem */}
          {footerData.map((section, index) => (
            <div key={index} className={`${styles.footerItem} `}>

              <h3>{section.title}</h3>

              {/* footerItem ul */}
              {section.content.length === 1 ? (
                <p className={`${styles.footerContent}`}>{section.content[0]}</p>
              ) : (
                <ul>
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* copyright */}
        <div className={`${styles.copyright} specialContainer`}>
          © 2025 BridgeX. All rights reserved.
        </div>
      </div>

    </footer>


  </>
}
