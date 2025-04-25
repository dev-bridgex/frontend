/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import styles from "./EditSubTeam.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditSubTeam({ communityId, teamId, subTeamId  , refetch }) {
    const [name, setName] = useState("");
    const [joinLink, setJoinLink] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/core`;

        const body = {
            Name: name,
            JoinLink: joinLink,
        };

        try {
            await axios.patch(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage("Sub-team updated successfully!");
            refetch();
            setTimeout(() => {
                document.getElementById("closeEditSubTeamModal").click();
            }, 1000);

        } catch (error) {
            const message =
                error.response?.data?.Message || "Failed to update sub-team.";
            setErrorMessage(message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.EditSubTeam}>
            <div
                className="modal fade"
                id="editSubTeamModal"
                tabIndex="-1"
                aria-labelledby="editSubTeamModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className={`${styles.subTeamContent} modal-content goldborder`}>
                        <div className={`${styles.subTeamHeader} modal-header border-0`}>
                            <h4 className={styles.headerTitle} id="editSubTeamModalLabel">
                                Edit Sub-Team
                            </h4>
                            <i
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="closeEditSubTeamModal"
                                className={`${styles.closeBtn} fas fa-xmark`}
                            ></i>
                        </div>

                        <div className={`${styles.subTeamBody} modal-body`}>
                            <form className={styles.subTeamForm} onSubmit={handleSubmit}>
                                <div className={styles.inputsWrapper}>
                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="editSubTeamName">
                                            Sub-Team Name
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="text"
                                            id="editSubTeamName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Sub-Team Name (letters and numbers only)"
                                            maxLength={15}
                                            pattern="^[a-zA-Z0-9]+$"
                                        />
                                        <small className="form-text text-muted">
                                            Max 15 characters, letters and numbers only
                                        </small>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="editSubTeamJoinLink">
                                            Join Link (optional)
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="url"
                                            id="editSubTeamJoinLink"
                                            value={joinLink}
                                            onChange={(e) => setJoinLink(e.target.value)}
                                            placeholder="Enter Join Link (optional)"
                                            maxLength={500}
                                        />
                                        <small className="form-text text-muted">
                                            Max 500 characters, must be a valid URL
                                        </small>
                                    </div>
                                </div>

                                {successMessage && (
                                    <div className="alert alert-success mt-1 py-2" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-1 py-2" role="alert">
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
                                    id="closeEditSubTeamModal"
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