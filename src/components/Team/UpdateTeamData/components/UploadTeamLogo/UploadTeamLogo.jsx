/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import axios from "axios";
import styles from "./UploadTeamLogo.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function UploadTeamLogo({ teamId, communityId, refetch }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [sizeError, setSizeError] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadSuccess(false);
    setUploadError(null);
    setSizeError(null);

    if (file.size > MAX_FILE_SIZE) {
      setSizeError("File size exceeds 10MB limit. Please choose a smaller image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSizeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.size > MAX_FILE_SIZE) {
      setSizeError("File size exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setSizeError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("token");
      const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/logo`;

      await axios.post(url, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      refetch();
    } catch (error) {
      setUploadError(error.response?.data?.Message || error.message || "Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${styles.logoUpload}`}>
      <label htmlFor="teamLogo" className={`${styles.uploadLabel}`}>
        <div className={`${styles.logoCircle}`}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          ) : (
            <span className={styles.uploadText}>
              {selectedFile ? selectedFile.name : "Click to Upload Logo"}
            </span>
          )}
        </div>
        <input
          type="file"
          id="teamLogo"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>

      <p className={styles.labelText}>Team Logo</p>
      <p className={styles.sizeLimitText}>Maximum logo size: 10MB</p>

      {sizeError && <div className="alert alert-warning py-2 mt-1">{sizeError}</div>}

      {selectedFile && (
        <div className={`${styles.actionsContainer}`}>
          <button
            onClick={handleCancelSelection}
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={isUploading}
          >
            Change Logo
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`${styles.button} ${styles.uploadButton}`}
          >
            {isUploading ? (
              <>
                <span className={styles.spinner}></span>
                Uploading...
              </>
            ) : (
              "Submit Logo"
            )}
          </button>
        </div>
      )}

      {uploadError && <div className="alert alert-danger py-2 mt-1">{uploadError}</div>}
      {uploadSuccess && <div className="alert alert-success py-2 mt-1">Logo uploaded successfully!</div>}
    </div>
  );
}