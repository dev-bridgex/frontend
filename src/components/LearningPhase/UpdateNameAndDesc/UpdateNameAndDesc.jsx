/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UpdateNameAndDesc.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function UpdateNameAndDesc({ communityId, teamId, subTeamId, initialData, refetch }) {


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Character limits from schema
    const nameMinLength = 5;
    const nameMaxLength = 15;
    const descMinLength = 5;
    const descMaxLength = 325;

    // Set initial values when component mounts or initialData changes
    useEffect(() => {
        if (initialData) {
            setName(initialData.TiTle || "");
            setDescription(initialData.Desc || "");
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate inputs
        if (name.length < nameMinLength || name.length > nameMaxLength) {
            setErrorMessage(`Name must be between ${nameMinLength}-${nameMaxLength} characters`);
            setTimeout(() => setErrorMessage(""), 3000);
            setIsLoading(false);
            return;
        }

        if (description.length < descMinLength || description.length > descMaxLength) {
            setErrorMessage(`Description must be between ${descMinLength}-${descMaxLength} characters`);
            setTimeout(() => setErrorMessage(""), 3000);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase`;

        const body = {
            Name: name,
            Desc: description,
        };

        try {
            await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSuccessMessage("Learning phase updated successfully!");
            refetch();
            setTimeout(() => {
                document.getElementById("closeUpdateModal").click();
            }, 1000);

        } catch (error) {
            const message =
                error.response?.data?.Message || "Failed to update learning phase.";
            setErrorMessage(message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.UpdateNameAndDesc}>
            <div
                className="modal fade"
                id="updateNameAndDescModal"
                tabIndex="-1"
                aria-labelledby="updateNameAndDescModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className={`${styles.modalContent} modal-content goldborder`}>
                        <div className={`${styles.modalHeader} modal-header border-0`}>
                            <h4 className={styles.headerTitle} id="updateNameAndDescModalLabel">
                                Update name and description
                            </h4>
                            <i
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="closeUpdateModal"
                                className={`${styles.closeBtn} fas fa-xmark`}
                            ></i>
                        </div>

                        <div className={`${styles.modalBody} modal-body`}>
                            <form className={styles.updateForm} onSubmit={handleSubmit}>
                                <div className={styles.inputsWrapper}>
                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="learningPhaseName">
                                            Name ({nameMinLength}-{nameMaxLength} characters)
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="text"
                                            id="learningPhaseName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Learning Phase Name"
                                            minLength={nameMinLength}
                                            maxLength={nameMaxLength}
                                            required
                                        />
                                        <div className={styles.charCounter}>
                                            {name.length}/{nameMaxLength}
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="learningPhaseDesc">
                                            Description ({descMinLength}-{descMaxLength} characters)
                                        </label>
                                        <textarea
                                            className="inputStyle"
                                            id="learningPhaseDesc"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter Learning Phase Description"
                                            rows={4}
                                            minLength={descMinLength}
                                            maxLength={descMaxLength}
                                            required
                                        />
                                        <div className={styles.charCounter}>
                                            {description.length}/{descMaxLength}
                                        </div>
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
                                        {isLoading ? "Updating..." : "Update"}
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
                                    id="closeUpdateModal"
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