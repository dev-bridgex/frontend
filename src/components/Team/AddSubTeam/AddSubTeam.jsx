/* eslint-disable react/prop-types */
import styles from "./AddSubTeam.module.css";
import axios from "axios";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddSubTeam({ communityId, teamId, refetch }) {
  // State management
  const [subTeamName, setSubTeamName] = useState("");
  const [joinLink, setJoinLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length > 15) return "Name must be 15 characters or less";
    return "";
  };

  const validateJoinLink = (link) => {
    if (!link.trim()) return "Join link is required";
    if (link.length > 500) return "Link must be 500 characters or less";

    try {
      new URL(link); // Validate URL format
      return "";
    } catch {
      return "Please enter a valid URL";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const nameError = validateName(subTeamName);
    const linkError = validateJoinLink(joinLink);

    if (nameError || linkError) {
      setError(nameError || linkError);
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

      // Prepare request body
      const requestBody = {
        Name: subTeamName,
        JoinLink: joinLink,
      };

      const response = await axios.post(
        `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      if (response.data.Success) {
        setSuccess(response.data.Message || "Sub-team created successfully!");
        setSubTeamName("");
        setJoinLink("");
        refetch();

        setTimeout(() => {
          document.getElementById("closeAddSubTeamModal").click();
        }, 2000);
      } else {
        throw new Error(response.data.Message || "Failed to create sub-team");
      }
    } catch (err) {
      setError(
        err.response?.data?.Message ||
        err.message ||
        "Failed to create sub-team"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setSubTeamName(value);
    if (error && validateName(value) !== error) {
      setError("");
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setJoinLink(value);
    if (error && validateJoinLink(value) !== error) {
      setError("");
    }
  };

  return (
    <section className={styles.AddSubTeam}>
      <div
        className="modal fade"
        id="addSubTeamModal"
        tabIndex="-1"
        aria-labelledby="addSubTeamModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className={`${styles.subTeamContent} modal-content goldborder`}>
            <div className={`${styles.subTeamHeader} modal-header border-0`}>
              <h4 className={styles.headerTitle} id="addSubTeamModalLabel">
                Add New Sub-Team
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className={`${styles.closeBtn} fas fa-xmark`}
                id="closeAddSubTeamModal"
              ></i>
            </div>

            <div className={`${styles.subTeamBody} modal-body`}>
              <form className={styles.subTeamForm} onSubmit={handleSubmit}>
                <div className={styles.inputsWrapper}>
                  <div className={styles.inputGroup}>
                    <label className="lableStyle" htmlFor="subTeamName">
                      Sub-Team Name *
                    </label>
                    <input
                      className={`inputStyle ${error && error.includes("Name") ? styles.inputError : ""}`}
                      type="text"
                      id="subTeamName"
                      placeholder="Enter Sub-Team Name"
                      value={subTeamName}
                      onChange={handleNameChange}
                      maxLength={15}
                      required
                    />
                    <div className={styles.characterCount}>
                      {subTeamName.length}/15 characters
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className="lableStyle" htmlFor="joinLink">
                      Join Link *
                    </label>
                    <input
                      className={`inputStyle ${error && error.includes("Link") ? styles.inputError : ""}`}
                      type="url"
                      id="joinLink"
                      placeholder="https://example.com/join"
                      value={joinLink}
                      onChange={handleLinkChange}
                      maxLength={500}
                      required
                    />
                    <div className={styles.characterCount}>
                      {joinLink.length}/500 characters
                    </div>
                  </div>
                </div>

                {error && (
                  <div className={`alert alert-danger py-2 mt-1 mb-0 ${styles.errorMessage}`}>
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
                    {isLoading ? "Creating..." : "Create Sub-Team"}
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