/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditTeam.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditTeam({ communityId, teamId, refetch, initialData }) {
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
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/core`;

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

            setSuccessMessage("Team updated successfully!");
            refetch();
            setTimeout(() => {
                document.getElementById("closeEditTeamModal").click();
            }, 1000);

        } catch (error) {
            const message =
                error.response?.data?.Message || "Failed to update team.";
            setErrorMessage(message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.EditTeam}>
            <div
                className="modal fade"
                id="editTeamModal"
                tabIndex="-1"
                aria-labelledby="editTeamModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className={`${styles.teamContent} modal-content goldborder`}>
                        <div className={`${styles.teamHeader} modal-header border-0`}>
                            <h4 className={styles.headerTitle} id="editTeamModalLabel">
                                Edit Team
                            </h4>
                            <i
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="closeEditTeamModal"
                                className={`${styles.closeBtn} fas fa-xmark`}
                            ></i>
                        </div>

                        <div className={`${styles.teamBody} modal-body`}>
                            <form className={styles.teamForm} onSubmit={handleSubmit}>
                                <div className={styles.inputsWrapper}>
                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="editTeamName">
                                            Team Name
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="text"
                                            id="editTeamName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Team Name"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="editTeamEmail">
                                            Leader Email
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="email"
                                            id="editTeamEmail"
                                            value={leaderEmail}
                                            onChange={(e) => setLeaderEmail(e.target.value)}
                                            placeholder="Enter Leader Email"
                                        />
                                    </div>
                                </div>

                                {successMessage && (
                                    <div className="alert alert-success mt-1 py-2 mb-0" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-1 py-2 mb-0" role="alert">
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

                                <button
                                    type="button"
                                    id="closeEditTeamModal"
                                    data-bs-dismiss="modal"
                                    style={{ display: "none" }}
                                ></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}