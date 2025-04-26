/* eslint-disable react/prop-types */
import styles from "./AddMember.module.css";
import axios from "axios";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddMember({ communityId, teamId, subTeamId, refetch }) {
  // State management
  const [userEmail, setUserEmail] = useState("");
  const [isHead, setIsHead] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (email.length > 100) return "Email must be 100 characters or less";
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const emailError = validateEmail(userEmail);
    
    if (emailError) {
      setError(emailError);
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/add`,
        {
          UserEmail: userEmail,
          IsHead: isHead,
          JoinDate: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Member added successfully!");
      setUserEmail("");
      setIsHead(false);
      refetch();

      setTimeout(() => {
        document.getElementById("closeAddMemberModal").click();
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.Message || 
        err.message || 
        "Failed to add member"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
    // Clear error when user starts correcting
    if (error && validateEmail(value) !== error) {
      setError("");
    }
  };

  const handleIsHeadChange = (e) => {
    setIsHead(e.target.checked);
  };

  return (
    <section className={styles.AddMember}>
      <div
        className="modal fade"
        id="addMemberModal"
        tabIndex="-1"
        aria-labelledby="addMemberModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className={`${styles.memberContent} modal-content goldborder`}>
            <div className={`${styles.memberHeader} modal-header border-0`}>
              <h4 className={styles.headerTitle} id="addMemberModalLabel">
                Add New Member
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className={`${styles.closeBtn} fas fa-xmark`}
                id="closeAddMemberModal"
              ></i>
            </div>

            <div className={`${styles.memberBody} modal-body`}>
              <form className={styles.memberForm} onSubmit={handleSubmit}>
                <div className={styles.inputsWrapper}>
                  <div className={styles.inputGroup}>
                    <label className="lableStyle" htmlFor="userEmail">
                      Member Email *
                    </label>
                    <input
                      className={`inputStyle ${error && error.includes("Email") ? styles.inputError : ""}`}
                      type="email"
                      id="userEmail"
                      placeholder="Enter member's email address"
                      value={userEmail}
                      onChange={handleEmailChange}
                      maxLength={100}
                      required
                    />
                    <div className={styles.characterCount}>
                      {userEmail.length}/100 characters
                    </div>
                  </div>

                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="isHead"
                      checked={isHead}
                      onChange={handleIsHeadChange}
                    />
                    <label htmlFor="isHead">Is Team Head</label>
                  </div>
                </div>

                {error && (
                  <div className={`alert alert-danger py-2 mt-2 mb-0 ${styles.errorMessage}`}>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success py-2 mt-1 mb-0">
                    {success}
                  </div>
                )}

                <div className={styles.buttonsWrapper}>
                  <button
                    className="ButtonStyle"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Member"}
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className="ButtonStyle"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}