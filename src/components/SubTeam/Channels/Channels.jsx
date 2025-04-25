
import styles from "./Channels.module.css";

export default function Channels() {


    return <>

        {/* channelsSection */}
        <section className={`${styles.channelsSection}`}>

            {/* channelsContainer */}
            <div className={`${styles.channelsContainer}`}>

                {/* channelsHeader */}
                <div className={`${styles.channelsHeader}`}>
                    <h3 className={`${styles.title}`}>Channels</h3>
                </div>

                {/* channelContent */}
                <div className={`${styles.channelContent}`}>

                    {/* channel  */}
                    <div className={`${styles.channel}`}>general</div>
                    <div className={`${styles.channel}`}>project-discussions</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                    <div className={`${styles.channel}`}>announcements</div>
                </div>

            </div>

        </section>

    </>
}
