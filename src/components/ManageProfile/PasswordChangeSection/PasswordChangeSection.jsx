/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './PasswordChangeSection.module.css';

export default function PasswordChangeSection({
  isVisible,
  passwordForm,
  loading,
  onPasswordChange,
  onSubmit,
}) {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough]
      .filter(Boolean).length;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const handlePasswordChange = (e) => {
    if (e.target.name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(e.target.value));
    }
    onPasswordChange(e);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        <i className="fas fa-lock"></i>
        Change Password
      </h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label>
            <i className="fas fa-key"></i>
            Current Password
          </label>
          <input
            type={showPasswords.oldPassword ? "text" : "password"}
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => togglePasswordVisibility('oldPassword')}
          >
            <i className={`fas ${showPasswords.oldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>
            <i className="fas fa-key"></i>
            New Password
          </label>
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => togglePasswordVisibility('newPassword')}
          >
            <i className={`fas ${showPasswords.newPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
          {passwordForm.newPassword && (
            <>
            
              <div className={styles.strengthText}>
                {passwordStrength === 'weak' && (
                  <span className={styles.weakText}>
                    <i className="fas fa-exclamation-circle"></i>
                    Weak password - Add numbers, symbols, and mixed case letters
                  </span>
                )}
                {passwordStrength === 'medium' && (
                  <span className={styles.mediumText}>
                    <i className="fas fa-info-circle"></i>
                    Medium password - Add more variety to make it stronger
                  </span>
                )}
                {passwordStrength === 'strong' && (
                  <span className={styles.strongText}>
                    <i className="fas fa-check-circle"></i>
                    Strong password - Good job!
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            <i className="fas fa-check-double"></i>
            Confirm New Password
          </label>
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => togglePasswordVisibility('confirmPassword')}
          >
            <i className={`fas ${showPasswords.confirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
          {passwordForm.newPassword !== passwordForm.confirmPassword && 
            passwordForm.confirmPassword && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                Passwords do not match
              </div>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || 
            passwordForm.newPassword !== passwordForm.confirmPassword ||
            !passwordForm.oldPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword}
        >
          <i className="fas fa-lock"></i>
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
