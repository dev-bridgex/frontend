/* eslint-disable react/prop-types */
import styles from './ProfileEditForm.module.css';

export default function ProfileEditForm({
  profile,
  loading,
  onInputChange,
  onSubmit,
  onCancel
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-user"></i>
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={profile.firstName}
          onChange={onInputChange}
          placeholder="Enter your first name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-user"></i>
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={profile.lastName}
          onChange={onInputChange}
          placeholder="Enter your last name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-phone"></i>
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={profile.phoneNumber}
          onChange={onInputChange}
          placeholder="Enter your phone number"
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-id-card"></i>
          Student ID
        </label>
        <input
          type="text"
          name="studentId"
          value={profile.studentId}
          onChange={onInputChange}
          placeholder="Enter your student ID"
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-users"></i>
          User Type
        </label>
        <select
          name="userType"
          value={profile.userType}
          onChange={onInputChange}
        >
          <option value="STUDENT">Student</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={loading}
        >
          <i className="fas fa-save"></i>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          <i className="fas fa-times"></i>
          Cancel
        </button>
      </div>
    </form>
  );
}
