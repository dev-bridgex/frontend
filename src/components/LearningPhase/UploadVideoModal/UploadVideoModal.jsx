/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import styles from "./UploadVideoModal.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function UploadVideoModal({ communityId, teamId, subTeamId, sectionId, refetch, onClose }) {
  const [videoData, setVideoData] = useState({
    name: "",
    desc: "",
    file: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!videoData.name.trim()) return "Video name is required";
    if (videoData.name.length < 5 || videoData.name.length > 15)
      return "Name must be between 5-15 characters";
    if (!videoData.desc.trim()) return "Description is required";
    if (videoData.desc.length < 5 || videoData.desc.length > 325)
      return "Description must be between 5-325 characters";
    if (!videoData.file) return "Video file is required";
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
      formData.append("Name", videoData.name);
      formData.append("Desc", videoData.desc);
      formData.append("file", videoData.file);

      await axios.post(
        `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSuccess("Video uploaded successfully!");
      setVideoData({
        name: "",
        desc: "",
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
        "Failed to upload video"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    setVideoData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
    if (error) setError("");
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className={`${styles.videoContent} modal-content goldborder`}>
          <div className={`${styles.videoHeader} modal-header border-0`}>
            <h4 className={styles.headerTitle}>
              Upload New Video
            </h4>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => {
                setVideoData({ name: "", desc: "", file: null });
                setError("");
                setSuccess("");
                onClose();
              }}
              aria-label="Close"
            >
              <i className="fas fa-xmark"></i>
            </button>
          </div>

          <div className={`${styles.videoBody} modal-body`}>
            <form className={styles.videoForm} onSubmit={handleSubmit}>
              <div className={styles.inputsWrapper}>
                <div className={styles.inputGroup}>
                  <label className="labelStyle" htmlFor="videoName">
                    Video Name (5-15 characters)
                  </label>
                  <input
                    className={`${styles.inputStyle} ${error && error.includes("Name") ? styles.inputError : ""}`}
                    type="text"
                    id="videoName"
                    name="name"
                    value={videoData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Video Name"
                    minLength={5}
                    maxLength={15}
                    required
                  />
                  <div className={styles.characterCount}>
                    {videoData.name.length}/15
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className="labelStyle" htmlFor="videoDesc">
                    Description (5-325 characters)
                  </label>
                  <textarea
                    className={`${styles.inputStyle} ${error && error.includes("Description") ? styles.inputError : ""}`}
                    id="videoDesc"
                    name="desc"
                    value={videoData.desc}
                    onChange={handleInputChange}
                    placeholder="Enter Video Description"
                    rows={3}
                    minLength={5}
                    maxLength={325}
                    required
                  />
                  <div className={styles.characterCount}>
                    {videoData.desc.length}/325
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className="labelStyle" htmlFor="videoFile">
                    Video File
                  </label>
                  <input
                    className={styles.inputStyle}
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 mt-2 mb-0">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success py-2 mt-2 mb-0">
                  {success}
                </div>
              )}

              <div className={styles.buttonsWrapper}>
                <button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : "Upload Video"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoData({ name: "", desc: "", file: null });
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
