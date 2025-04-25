/* eslint-disable react/prop-types */
import styles from "./AddAchievement.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Validation schema for achievement
const achievementSchema = yup.object().shape({
  title: yup.string()
    .required("Title is required")
    .max(100, "Title must be less than 100 characters"),
  desc: yup.string()
    .required("Description is required")
    .max(500, "Description must be less than 500 characters"),
  file: yup.mixed()
    .required("Image is required")
    .test(
      "fileType",
      "Only image files are allowed",
      (value) => value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
    )
    .test(
      "fileSize",
      "File size must be less than 5MB",
      (value) => value && value.size <= 5 * 1024 * 1024
    )
});

export default function AddAchievement({ communityId, teamId, refetch }) {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    desc: ""
  });

  // File state
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form validation
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // API state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Character counters
  const [charCounts, setCharCounts] = useState({
    title: { current: 0, max: 100 },
    desc: { current: 0, max: 500 }
  });

  // Update character counts
  useEffect(() => {
    setCharCounts(prev => ({
      ...prev,
      title: { ...prev.title, current: formData.title?.length || 0 },
      desc: { ...prev.desc, current: formData.desc?.length || 0 }
    }));
  }, [formData]);

  // Validate form on change
  useEffect(() => {
    const validateForm = async () => {
      try {
        await achievementSchema.validate(
          { ...formData, file },
          { abortEarly: false }
        );
        setFormErrors({});
        setIsFormValid(true);
      } catch (err) {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
        setIsFormValid(false);
      }
    };

    validateForm();
  }, [formData, file]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setTouchedFields(prev => ({ ...prev, [id]: true }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/achievement`;

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Desc", formData.desc);
      formDataToSend.append("file", file);

      await axios.post(url, formDataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitSuccess(true);
      // Reset form on success
      setFormData({ title: "", desc: "" });
      setFile(null);
      setFilePreview(null);
      setTouchedFields({});
      refetch();
    } catch (error) {
      const errorMsg = error.response?.data?.Message ||
        error.message ||
        "Failed to upload achievement";
      setSubmitError(errorMsg);
      setTimeout(() => setSubmitError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touchedFields[fieldName] ? formErrors[fieldName] : "";
  };

  // Helper function to render character counter
  const renderCharCounter = (field) => {
    const { current, max } = charCounts[field];
    const isNearLimit = current > max * 0.8;
    const isOverLimit = current > max;

    return (
      <span
        className={`${styles.charCounter} ${isNearLimit ? styles.nearLimit : ""
          } ${isOverLimit ? styles.overLimit : ""}`}
      >
        {current}/{max}
      </span>
    );
  };

  return (
    <section className={styles.UploadAchievement}>
      <h1>Add New Achievement</h1>

      <form className={styles.infoSection} onSubmit={handleSubmit}>
        {/* Title Section */}
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="title">Achievement Title</label>
            {renderCharCounter('title')}
          </div>
          <input
            type="text"
            id="title"
            placeholder="Enter achievement title (max 100 characters)"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, title: true }))}
            className={getFieldError("title") ? styles.errorInput : ""}
          />
          {getFieldError("title") && (
            <span className={styles.errorText}>{getFieldError("title")}</span>
          )}
        </div>

        {/* Description Section */}
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="desc">Description</label>
            {renderCharCounter('desc')}
          </div>
          <textarea
            id="desc"
            rows="4"
            placeholder="Describe the achievement (max 500 characters)"
            value={formData.desc}
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, desc: true }))}
            className={getFieldError("desc") ? styles.errorInput : ""}
          />
          {getFieldError("desc") && (
            <span className={styles.errorText}>{getFieldError("desc")}</span>
          )}
        </div>

        {/* Image Upload Section */}
        <div className={styles.formGroup}>
          <label htmlFor="file">Achievement Image</label>

          <div
            className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="file" className={styles.plusIconLabel}>
              <svg className={styles.plusIcon} viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </label>
            <p className={styles.dragText}>or drag and drop image here</p>
            {file && (
              <span className={styles.fileName}>{file.name}</span>
            )}
          </div>
          {formErrors.file && (
            <span className={styles.errorText}>{formErrors.file}</span>
          )}

          {/* Image Preview */}
          {filePreview && (
            <div className={styles.imagePreview}>
              <img src={filePreview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className={styles.submitSection}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Add Achievement...
              </>
            ) : (
              "Add Achievement"
            )}
          </button>

          {/* Status Messages */}
          <div className={styles.messagesContainer}>
            {submitError && (
              <div className={styles.errorMessage}>
                <div className={styles.messageContent}>
                  <svg className={styles.messageIcon} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className={styles.successMessage}>
                <div className={styles.messageContent}>
                  <svg className={styles.messageIcon} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Achievement uploaded successfully!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}