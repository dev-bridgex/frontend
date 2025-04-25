/* eslint-disable react/prop-types */
import styles from "./CreateCommunity.module.css";
import axios from "axios";
import { useState } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function CreateCommunity({ refetch }) {


  // handle state management
  const [communityName, setCommunityName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!communityName.trim() || !leaderEmail.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${baseUrl}/api/communities`,
        {
          Name: communityName,
          LeaderEmail: leaderEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setSuccess("Community created successfully!");

      // Close modal and reset form
      setCommunityName("");
      setLeaderEmail("");

      setTimeout(() => {

        document.getElementById("closeCreateCommunityModal").click();

      }, 1000);
      refetch();


    } catch (err) {
      setError(err.response?.data?.Message || err.message || "Failed to create community");
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <section className={`${styles.CreateCommunity} `}>
      <div
        className="modal fade"
        id="createCommunityModal"
        tabIndex="-1"
        aria-labelledby="createCommunityModalLable"
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered modal-lg `}>
          <div className={`${styles.communityContent} modal-content goldborder`}>
            <div className={`${styles.communityHeader} modal-header border-0`}>
              <h4 className={`${styles.headerTitle}`} id="createCommunityModalLable">
                Create New Community
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className={`${styles.closeBtn} fas fa-xmark`}
                id="closeCreateCommunityModal"
              ></i>
            </div>

            <div className={`${styles.communityBody} modal-body`}>
              <form className={`${styles.communityForm}`} onSubmit={handleSubmit}>
                <div className={`${styles.inputsWrapper}`}>
                  <div className={`${styles.inputGroup}`}>
                    <label className="lableStyle" htmlFor="communityName">
                      Community Name
                    </label>
                    <input
                      className="inputStyle"
                      type="text"
                      id="communityName"
                      placeholder="Enter Community Name"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.inputGroup}`}>
                    <label className="lableStyle" htmlFor="leaderEmail">
                      Leader Email
                    </label>
                    <input
                      className="inputStyle"
                      type="email"
                      id="leaderEmail"
                      placeholder="Enter leader email"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 mt-1 mb-0">{error}</div>
                )}

                {success && (
                  <div className="alert alert-success py-2 mt-1 mb-0">{success}</div>
                )}

                <div className={`${styles.buttonsWrapper}`}>
                  <button
                    className="ButtonStyle"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Community"}
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