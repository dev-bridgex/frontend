import styles from "./JoinUsSection.module.css"

export default function JoinUsSection() {



  return <>
    {/*  JoinUsSection*/}
    <section className={`${styles.JoinUsSection}`}>

      {/* joinUsContainer */}
      <div className={`${styles.joinUsContainer} specialContainer`}>

        <h1 className={`${styles.JoinUsTitle}`}>Join BridgeX & Start Learning Today!</h1>
        <h6 className={`${styles.JoinUsDescription}`}>
          Discover structured learning, AI-powered assistance, and interactive collaboration—all in one platform.
        </h6>

        <button className={`${styles.JoinUsButton} ButtonStyle`}>Get Started Now! <i className="fas fa-arrow-right-long ms-2"></i></button>


      </div>


    </section>





  </>
}
