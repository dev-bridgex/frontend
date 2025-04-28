/* eslint-disable react/prop-types */
import styles from './ProfileViewMode.module.css';

export default function ProfileViewMode({ profile, onEditClick }) {
  return (
    <div className={styles.viewMode}>
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-user"></i>
          First Name
        </span>
        <span className={styles.value}>{profile.firstName}</span>
      </div>
      
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-user"></i>
          Last Name
        </span>
        <span className={styles.value}>{profile.lastName}</span>
      </div>
      
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-envelope"></i>
          Email
        </span>
        <span className={styles.value}>{profile.email}</span>
      </div>
      
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-phone"></i>
          Phone Number
        </span>
        <span className={styles.value}>{profile.phoneNumber || 'Not set'}</span>
      </div>
      
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-id-card"></i>
          Student ID
        </span>
        <span className={styles.value}>{profile.studentId || 'N/A'}</span>
      </div>
      
      <div className={styles.infoRow}>
        <span className={styles.label}>
          <i className="fas fa-users"></i>
          User Type
        </span>
        <span className={styles.value}>{profile.userType}</span>
      </div>

      <button onClick={onEditClick} className={styles.editButton}>
        <i className="fas fa-edit"></i>
        Edit Profile
      </button>
    </div>
  );
}
