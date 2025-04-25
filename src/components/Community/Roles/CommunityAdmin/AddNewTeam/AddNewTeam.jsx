/* eslint-disable react/prop-types */
import styles from "./AddNewTeam.module.css";
import axios from "axios";
import { useState } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddNewTeam({ communityId, refetch }) {


  // handle state management
  const [teamName, setTeamName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!teamName.trim() || !leaderEmail.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(`${baseUrl}/api/communities/${communityId}/teams`,
        {
          Name: teamName,
          LeaderEmail: leaderEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setSuccess("Team created successfully!");

      // Reset form
      setTeamName("");
      setLeaderEmail("");

      setTimeout(() => {
        document.getElementById("closeAddTeamModal").click();
      }, 2000);
      refetch();

    } catch (err) {
      setError(err.response?.data?.Message || err.message || "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`${styles.AddNewTeam}`}>
      <div
        className="modal fade"
        id="addTeamModal"
        tabIndex="-1"
        aria-labelledby="addTeamModalLabel"
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered modal-lg`}>
          <div className={`${styles.teamContent} modal-content goldborder`}>
            <div className={`${styles.teamHeader} modal-header border-0`}>
              <h4 className={`${styles.headerTitle}`} id="addTeamModalLabel">
                Add New Team
              </h4>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className={`${styles.closeBtn} fas fa-xmark`}
                id="closeAddTeamModal"
              ></i>
            </div>

            <div className={`${styles.teamBody} modal-body`}>
              <form className={`${styles.teamForm}`} onSubmit={handleSubmit}>
                <div className={`${styles.inputsWrapper}`}>
                  <div className={`${styles.inputGroup}`}>
                    <label className="lableStyle" htmlFor="teamName">
                      Team Name
                    </label>
                    <input
                      className="inputStyle"
                      type="text"
                      id="teamName"
                      placeholder="Enter Team Name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
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
                    {isLoading ? "Creating..." : "Create Team"}
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