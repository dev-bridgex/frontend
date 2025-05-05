/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UpdateSectionModal.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function UpdateSectionModal({

    communityId,
    teamId,
    subTeamId,
    sectionId,
    initialData,
    refetch,
    onClose
}) {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const nameMinLength = 5;
    const nameMaxLength = 15;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setNumber(initialData.number || "");
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

        if (!number || isNaN(number) || number < 1) {
            setErrorMessage("Section number must be a positive number");
            setTimeout(() => setErrorMessage(""), 3000);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}`;

        const body = {
            Name: name,
            Number: parseInt(number),
        };

        try {
            await axios.patch(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
            });

            setSuccessMessage("Section updated successfully!");
            refetch();

            setTimeout(() => {
                setName("");
                setNumber("");
                setSuccessMessage("");
                onClose();
            }, 1500);

        } catch (error) {
            const message = error.response?.data?.Message ||
                error.message ||
                "Failed to update section. Please try again.";
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
        setNumber("");
        setErrorMessage("");
        setSuccessMessage("");
        onClose();
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className={`${styles.modalContent} modal-content goldborder`}>
                    <div className={`${styles.modalHeader} modal-header border-0`}>
                        <h4 className={styles.headerTitle}>
                            Update Section
                        </h4>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={handleModalClose}
                            aria-label="Close"
                        >
                            <i className="fas fa-xmark"></i>
                        </button>
                    </div>

                    <div className={`${styles.modalBody} modal-body`}>
                        <form className={styles.sectionForm} onSubmit={handleSubmit}>
                            <div className={styles.inputsWrapper}>
                                <div className={styles.inputGroup}>
                                    <label className="labelStyle" htmlFor="sectionName">
                                        Section Name ({nameMinLength}-{nameMaxLength} characters)
                                    </label>
                                    <input
                                        className={`inputStyle ${name.length > nameMaxLength ? styles.invalidInput : ''}`}
                                        type="text"
                                        id="sectionName"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter Section Name"
                                        minLength={nameMinLength}
                                        maxLength={nameMaxLength}
                                        required
                                    />
                                    <div className={`${styles.charCounter} ${name.length > nameMaxLength ? styles.charCounterError : ''
                                        }`}>
                                        {name.length}/{nameMaxLength}
                                    </div>
                                    {name.length > nameMaxLength && (
                                        <div className={styles.errorText}>
                                            Maximum {nameMaxLength} characters allowed
                                        </div>
                                    )}
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
                                    disabled={isLoading || name.length > nameMaxLength}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : "Update Section"}
                                </button>
                                <button
                                    type="button"
                                    className="ButtonStyle"
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