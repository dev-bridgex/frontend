import styles from './ProfileHeader.module.css';

export default function ProfileHeader() {
  return (
    <section className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.content}>
          <h2 className={styles.title}>Manage Your Profile</h2>
          <p className={styles.subtitle}>
            Update your personal information, manage your profile photo, and secure your account settings in one convenient dashboard.
          </p>
        </div>
        <div className={styles.decorativeElements}>
          <div className={styles.circle}></div>
          <div className={styles.square}></div>
        </div>
      </div>
    </section>
  );
}
