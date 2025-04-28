/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditCommunity.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditCommunity({ communityId, refetch, initialData }) {


  const [name, setName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set initial values when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setLeaderEmail(initialData.leaderEmail || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const url = `${baseUrl}/api/communities/${communityId}/core`;

    const body = {
      Name: name,
      LeaderEmail: leaderEmail,
    };

    try {
      await axios.patch(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Community updated successfully!");

      setTimeout(() => {
        document.getElementById("closeEditCommunityModal").click();
      }, 1000);
      refetch();

    } catch (error) {
      setErrorMessage(error.response?.data?.Message || "Failed to update community.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.EditCommunity}>
      <div
        className="modal fade"
        id="editCommunityModal"
        tabIndex="-1"
        aria-labelledby="editCommunityModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className={`${styles.communityContent} modal-content goldborder`}>
            <div className={`${styles.communityHeader} modal-header border-0`}>
              <h4 className={styles.headerTitle} id="editCommunityModalLabel">
                Edit Community
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeEditCommunityModal"
                className={`${styles.closeBtn} fas fa-xmark`}
              ></i>
            </div>

            <div className={`${styles.communityBody} modal-body`}>
              <form className={styles.communityForm} onSubmit={handleSubmit}>
                <div className={styles.inputsWrapper}>
                  <div className={styles.inputGroup}>
                    <label className="labelStyle" htmlFor="editCommunityName">
                      Community Name
                    </label>
                    <input
                      className="inputStyle"
                      type="text"
                      id="editCommunityName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Community Name"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className="labelStyle" htmlFor="editCommunityEmail">
                      Leader Email
                    </label>
                    <input
                      className="inputStyle"
                      type="email"
                      id="editCommunityEmail"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="Enter Leader Email"
                    />
                  </div>
                </div>

                {/* Success & Error Messages */}
                {successMessage && (
                  <div className="alert alert-success  py-2 mt-1 mb-0" role="alert">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger py-2 mt-1 mb-0" role="alert">
                    {errorMessage}
                  </div>
                )}

                <div className={styles.buttonsWrapper}>
                  <button
                    type="submit"
                    className="ButtonStyle"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className="ButtonStyle"
                  >
                    Cancel
                  </button>
                </div>

                {/* Hidden close button for JS control */}
                <button
                  type="button"
                  id="closeEditCommunityModal"
                  data-bs-dismiss="modal"
                  style={{ display: "none" }}
                ></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}