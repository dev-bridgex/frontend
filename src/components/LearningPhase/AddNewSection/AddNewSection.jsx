/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddNewSection.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddNewSection({ communityId, teamId, subTeamId, refetch }) {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Schema constraints
    const nameMinLength = 5;
    const nameMaxLength = 15;

    // Clear messages when modal is closed
    useEffect(() => {
        const modal = document.getElementById('addNewSectionModal');
        const clearMessages = () => {
            setSuccessMessage("");
            setErrorMessage("");
        };

        modal.addEventListener('hidden.bs.modal', clearMessages);

        return () => {
            modal.removeEventListener('hidden.bs.modal', clearMessages);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Clear previous messages
        setSuccessMessage("");
        setErrorMessage("");

        // Validate inputs
        if (name.length < nameMinLength || name.length > nameMaxLength) {
            setErrorMessage(`Name must be between ${nameMinLength}-${nameMaxLength} characters`);
            setTimeout(() => setErrorMessage(""), 300);
            setIsLoading(false);
            return;
        }

        if (!number || isNaN(number) || number < 1) {
            setErrorMessage("Section number must be a positive number");
            setTimeout(() => setErrorMessage(""), 300);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section`;

        const body = {
            Name: name,
            Number: parseInt(number),
        };

        try {
            await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
            });

            setSuccessMessage("New section added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            refetch();

            // Reset form on success
            setName("");
            setNumber("");

        } catch (error) {
            setErrorMessage(error.response?.data?.Message || "An error occurred");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.AddNewSection}>
            <div
                className="modal fade"
                id="addNewSectionModal"
                tabIndex="-1"
                aria-labelledby="addNewSectionModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className={`${styles.modalContent} modal-content goldborder`}>
                        <div className={`${styles.modalHeader} modal-header border-0`}>
                            <h4 className={styles.headerTitle} id="addNewSectionModalLabel">
                                Add New Section
                            </h4>
                            <i
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="closeAddSectionModal"
                                className={`${styles.closeBtn} fas fa-xmark`}
                            ></i>
                        </div>

                        <div className={`${styles.modalBody} modal-body`}>
                            <form className={styles.sectionForm} onSubmit={handleSubmit}>
                                <div className={styles.inputsWrapper}>
                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="sectionName">
                                            Section Name ({nameMinLength}-{nameMaxLength} characters)
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="text"
                                            id="sectionName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Section Name"
                                            minLength={nameMinLength}
                                            maxLength={nameMaxLength}
                                            required
                                        />
                                        <div className={styles.charCounter}>
                                            {name.length}/{nameMaxLength}
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="labelStyle" htmlFor="sectionNumber">
                                            Section Number
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="number"
                                            id="sectionNumber"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                            placeholder="Enter Section Number"
                                            min="1"
                                            required
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
                                        {isLoading ? "Adding..." : "Add Section"}
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
                                    id="closeAddSectionModal"
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