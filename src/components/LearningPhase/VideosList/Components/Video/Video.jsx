/* eslint-disable react/prop-types */
import styles from "./Video.module.css";

const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

export default function Video({ videoData, onClose }) {

  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.videoModal}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>{videoData.title}</h5>
          <button 
            type="button" 
            className={styles.closeButton} 
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className={styles.videoPlayerWrapper}>
          <video controls className={styles.videoPlayer}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}