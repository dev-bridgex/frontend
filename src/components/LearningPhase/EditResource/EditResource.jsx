/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditResource.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditResource({
    communityId,
    teamId,
    subTeamId,
    sectionId,
    resourceId,
    initialData,
    refetch,
    onClose
}) {


    

    const [name, setName] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const nameMinLength = 5;
    const nameMaxLength = 15;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (name.length < nameMinLength || name.length > nameMaxLength) {
            setErrorMessage(`Name must be between ${nameMinLength}-${nameMaxLength} characters`);
            setTimeout(() => setErrorMessage(""), 3000);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/resource/${resourceId}`;

        const body = {
            Name: name,
        };

        try {
            await axios.patch(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
            });

            setSuccessMessage("Resource updated successfully!");
            refetch();

            setTimeout(() => {
                setName("");
                setSuccessMessage("");
                onClose();
            }, 1500);

        } catch (error) {
            const message = error.response?.data?.Message ||
                error.message ||
                "Failed to update resource. Please try again.";
            setErrorMessage(message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setName("");
        setErrorMessage("");
        setSuccessMessage("");
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>Edit Resource</h2>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={handleModalClose}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <form className={styles.resourceForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="resourceName" className={styles.formLabel}>
                                    Resource Name ({nameMinLength}-{nameMaxLength} characters)
                                </label>
                                <input
                                    type="text"
                                    id="resourceName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`${styles.formInput} ${name.length > nameMaxLength ? styles.invalidInput : ''}`}
                                    placeholder="Enter Resource Name"
                                    minLength={nameMinLength}
                                    maxLength={nameMaxLength}
                                    required
                                />
                                <div className={`${styles.charCounter} ${name.length > nameMaxLength ? styles.charCounterError : ''}`}>
                                    {name.length}/{nameMaxLength}
                                </div>
                                {name.length > nameMaxLength && (
                                    <div className={styles.errorText}>
                                        Maximum {nameMaxLength} characters allowed
                                    </div>
                                )}
                            </div>

                            {successMessage && (
                                <div className={styles.successMessage}>
                                    {successMessage}
                                </div>
                            )}
                            {errorMessage && (
                                <div className={styles.errorMessage}>
                                    {errorMessage}
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading || name.length > nameMaxLength}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Updating...
                                        </>
                                    ) : "Update Resource"}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={handleModalClose}
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
    );
}