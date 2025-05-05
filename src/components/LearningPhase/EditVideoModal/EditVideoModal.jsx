/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditVideoModal.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditVideoModal({
   
    onClose,
    communityId,
    teamId,
    subTeamId,
    sectionId,
    videoId,
    initialData,
    refetch
}) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const nameMinLength = 5;
    const nameMaxLength = 15;
    const descMinLength = 5;
    const descMaxLength = 325;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDesc(initialData.desc || "");
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

        if (desc.length < descMinLength || desc.length > descMaxLength) {
            setErrorMessage(`Description must be between ${descMinLength}-${descMaxLength} characters`);
            setTimeout(() => setErrorMessage(""), 3000);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video/${videoId}`;

        const body = {
            Name: name,
            Desc: desc,
        };

        try {
            await axios.patch(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
            });

            setSuccessMessage("Video updated successfully!");
            refetch();

            setTimeout(() => {
                setName("");
                setDesc("");
                setSuccessMessage("");
                onClose();
            }, 1500);

        } catch (error) {
            const message = error.response?.data?.Message ||
                error.message ||
                "Failed to update video. Please try again.";
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
        setDesc("");
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
                            Edit Video
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
                        <form className={styles.videoForm} onSubmit={handleSubmit}>
                            <div className={styles.inputsWrapper}>
                                <div className={styles.inputGroup}>
                                    <label className="labelStyle" htmlFor="videoName">
                                        Video Name ({nameMinLength}-{nameMaxLength} characters)
                                    </label>
                                    <input
                                        className={`inputStyle ${name.length > nameMaxLength ? styles.invalidInput : ''}`}
                                        type="text"
                                        id="videoName"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter Video Name"
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

                                <div className={styles.inputGroup}>
                                    <label className="labelStyle" htmlFor="videoDesc">
                                        Description ({descMinLength}-{descMaxLength} characters)
                                    </label>
                                    <textarea
                                        className={`inputStyle ${desc.length > descMaxLength ? styles.invalidInput : ''}`}
                                        id="videoDesc"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Enter Video Description"
                                        minLength={descMinLength}
                                        maxLength={descMaxLength}
                                        rows="4"
                                        required
                                    />
                                    <div className={`${styles.charCounter} ${desc.length > descMaxLength ? styles.charCounterError : ''}`}>
                                        {desc.length}/{descMaxLength}
                                    </div>
                                    {desc.length > descMaxLength && (
                                        <div className={styles.errorText}>
                                            Maximum {descMaxLength} characters allowed
                                        </div>
                                    )}
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
                                    disabled={isLoading || name.length > nameMaxLength || desc.length > descMaxLength}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : "Update Video"}
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