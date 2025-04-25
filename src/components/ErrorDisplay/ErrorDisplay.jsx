/* eslint-disable react/prop-types */
// src/components/ErrorDisplay/ErrorDisplay.jsx
import { useNavigate } from "react-router-dom";
import styles from "./ErrorDisplay.module.css";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

export default function ErrorDisplay({ error, onRetry }) {
  const navigate = useNavigate();

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2 className={styles.errorTitle}>Oops! Something Went Wrong</h2>
        <p className={styles.errorMessage}>
          {error?.message || "We encountered an error while loading your request. Please try again."}
        </p>

        <div className={styles.errorActions}>
          {onRetry && (
            <button onClick={onRetry} className={styles.errorButton}>
              <FaRedo className={styles.buttonIcon} /> Try Again
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className={styles.errorButtonSecondary}
          >
            <FaHome className={styles.buttonIcon} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
