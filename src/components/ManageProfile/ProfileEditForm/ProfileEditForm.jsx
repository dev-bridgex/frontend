/* eslint-disable react/prop-types */
import styles from './ProfileEditForm.module.css';
import { useState, useEffect } from 'react';

export default function ProfileEditForm({
  profile,
  loading,
  onInputChange,
  onSubmit,
  onCancel
}) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!profile.firstName || profile.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    } else if (profile.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }

    // Last Name validation
    if (!profile.lastName || profile.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    } else if (profile.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    // Student ID validation
    if (profile.studentId && profile.studentId.length > 50) {
      newErrors.studentId = 'Student ID cannot exceed 50 characters';
    }

    // Phone Number validation
    if (!profile.phoneNumber || profile.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^01[0-2,5][0-9]{8}$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Egyptian phone number (e.g., 01XXXXXXXXX)';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-user"></i>
          First Name*
        </label>
        <input
          type="text"
          name="FirstName"
          value={profile.firstName}
          onChange={onInputChange}
          placeholder="Enter your first name"
          className={errors.firstName ? styles.errorInput : ''}
        />
        {errors.firstName && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i> {errors.firstName}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-user"></i>
          Last Name*
        </label>
        <input
          type="text"
          name="LastName"
          value={profile.lastName}
          onChange={onInputChange}
          placeholder="Enter your last name"
          className={errors.lastName ? styles.errorInput : ''}
        />
        {errors.lastName && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i> {errors.lastName}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-phone"></i>
          Phone Number*
        </label>
        <input
          type="tel"
          name="PhoneNumber"
          value={profile.phoneNumber}
          onChange={onInputChange}
          placeholder="Enter your Egyptian phone number (e.g., 01XXXXXXXXX)"
          className={errors.phoneNumber ? styles.errorInput : ''}
        />
        {errors.phoneNumber && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i> {errors.phoneNumber}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-id-card"></i>
          Student ID
        </label>
        <input
          type="text"
          name="StudentId"
          value={profile.studentId || ''}
          onChange={onInputChange}
          placeholder="Enter your student ID"
          className={errors.studentId ? styles.errorInput : ''}
        />
        {errors.studentId && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i> {errors.studentId}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>
          <i className="fas fa-users"></i>
          User Type
        </label>
        <select
          name="UserType"
          value={profile.userType}
          onChange={onInputChange}
        >
          <option value="STUDENT">Student</option>
          <option value="EXTERNAL">External</option>
        </select>
      </div>

      {isValid ? (
        <div className={styles.successMessage}>
          <i className="fas fa-check-circle"></i> All fields are valid. You can submit the form.
        </div>
      ) : (
        <div className={styles.warningMessage}>
          <i className="fas fa-exclamation-triangle"></i> Please fix the errors before submitting.
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={loading || !isValid}
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