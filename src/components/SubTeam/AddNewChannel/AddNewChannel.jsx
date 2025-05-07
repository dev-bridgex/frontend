/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import styles from "./AddNewChannel.module.css";
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddNewChannel({ communityId, teamId, subTeamId, refetch }) {
  // State management
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  // Handle name change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setChannelName(value);
    setCharacterCount(value.length);
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!channelName.trim()) {
      setError("Channel name is required");
      return;
    }
    
    if (channelName.length > 30) {
      setError("Channel name must be 30 characters or less");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Prepare request body
      const requestBody = {
        Name: channelName
      };
      
      await axios.post(
        `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/channels`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json"
          }
        }
      );
      
      // Reset form
      setChannelName("");
      setCharacterCount(0);
      
      // Close modal after success
      document.getElementById("closeAddChannelModal").click();
      
      toast.success("Channel created successfully!", {
        position: "top-center",
        autoClose: 3000
      });
      
      // Refresh data
      refetch();
      
    } catch (error) {
      setError(error.response?.data?.Message || "Failed to create channel");
      toast.error(error.response?.data?.Message || "Failed to create channel", {
        position: "top-center",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.AddNewChannel}>
      <div
        className="modal fade"
        id="addChannelModal"
        tabIndex="-1"
        aria-labelledby="addChannelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className={`${styles.channelContent} modal-content goldborder`}>
            <div className={`${styles.channelHeader} modal-header border-0`}>
              <h4 className={styles.headerTitle} id="addChannelModalLabel">
                Add New Channel
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className={`${styles.closeBtn} fas fa-xmark`}
                id="closeAddChannelModal"
              ></i>
            </div>
            
            <div className={`${styles.channelBody} modal-body`}>
              <form className={styles.channelForm} onSubmit={handleSubmit}>
                <div className={styles.inputsWrapper}>
                  <div className={styles.inputGroup}>
                    <label className="lableStyle" htmlFor="channelName">
                      Channel Name *
                    </label>
                    <input
                      className={`inputStyle ${error ? styles.inputError : ""}`}
                      type="text"
                      id="channelName"
                      placeholder="Enter Channel Name"
                      value={channelName}
                      onChange={handleNameChange}
                      maxLength={30}
                      required
                    />
                    <div className={styles.characterCount}>
                      {characterCount}/30 characters
                    </div>
                    {error && <div className={`${styles.errorMessage} text-danger`}>{error}</div>}
                  </div>
                </div>
                
                <div className={styles.buttonsWrapper}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="PrimaryButtonStyle"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Channel"
                    )}
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="ButtonStyle"
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


