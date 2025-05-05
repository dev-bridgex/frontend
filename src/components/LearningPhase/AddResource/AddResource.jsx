/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import axios from "axios";
import styles from "./AddResource.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddResource({
    communityId,
    teamId,
    subTeamId,
    sectionId,
    refetch,
    onClose
}) {
    const [resourceData, setResourceData] = useState({
        name: "",
        file: null
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const validateInputs = () => {
        if (!resourceData.name.trim()) return "Resource name is required";
        if (resourceData.name.length < 5 || resourceData.name.length > 15)
            return "Name must be between 5-15 characters";
        if (!resourceData.file) return "Resource file is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const formData = new FormData();
            formData.append("Name", resourceData.name);
            formData.append("file", resourceData.file);

            await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/resource`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setSuccess("Resource uploaded successfully!");
            setResourceData({
                name: "",
                file: null
            });
            refetch();

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.Message ||
                err.message ||
                "Failed to upload resource"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResourceData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResourceData(prev => ({
                ...prev,
                file: e.target.files[0]
            }));
            if (error) setError("");
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>Add New Resource</h2>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => {
                                setResourceData({ name: "", file: null });
                                setError("");
                                setSuccess("");
                                onClose();
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <form className={styles.resourceForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="resourceName" className={styles.formLabel}>
                                    Resource Name (5-15 characters)
                                </label>
                                <input
                                    type="text"
                                    id="resourceName"
                                    name="name"
                                    value={resourceData.name}
                                    onChange={handleInputChange}
                                    className={`${styles.formInput} ${error && error.includes("Name") ? styles.inputError : ""}`}
                                    placeholder="Enter resource name"
                                    minLength={5}
                                    maxLength={15}
                                    required
                                />
                                <div className={styles.characterCount}>
                                    {resourceData.name.length}/15
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="resourceFile" className={styles.formLabel}>
                                    Resource File
                                </label>
                                <div
                                    className={`${styles.fileUpload} ${resourceData.file ? styles.fileSelected : ""}`}
                                    onClick={handleUploadAreaClick}
                                >
                                    <input
                                        type="file"
                                        id="resourceFile"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                        required
                                    />
                                    <div className={styles.fileUploadContent}>
                                        {resourceData.file ? (
                                            <p className={styles.fileName}>{resourceData.file.name}</p>
                                        ) : (
                                            <>
                                                <span className={styles.uploadIcon}>📁</span>
                                                <p className={styles.uploadText}>Click to upload or drag and drop</p>
                                                <p className={styles.fileRequirements}>PDF, DOC, PPT, etc. (Max 50MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className={styles.errorMessage}>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className={styles.successMessage}>
                                    {success}
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Uploading...
                                        </>
                                    ) : "Upload Resource"}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setResourceData({ name: "", file: null });
                                        setError("");
                                        setSuccess("");
                                        onClose();
                                    }}
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