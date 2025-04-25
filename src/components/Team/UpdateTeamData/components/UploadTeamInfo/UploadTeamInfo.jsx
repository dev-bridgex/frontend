/* eslint-disable react/prop-types */
import styles from "./UploadTeamInfo.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Validation schema for team info
const teamInfoSchema = yup.object().shape({
  shortDesc: yup.string()
    .required("Short description is required")
    .max(80, "Short description must be less than 80 characters"),
  desc: yup.string()
    .required("Description is required")
    .max(325, "Description must be less than 325 characters"),
  vision: yup.string()
    .required("Vision is required")
    .max(325, "Vision must be less than 325 characters"),
  links: yup.array().of(
    yup.object().shape({
      Name: yup.string()
        .required("Platform name is required")
        .max(255, "Platform name must be less than 255 characters"),
      Link: yup.string()
        .required("Link is required")
        .url("Must be a valid URL")
        .max(255, "Link must be less than 255 characters")
        .matches(
          /^(https?:\/\/)/,
          "URL must start with http:// or https://"
        )
    })
  ).required("Media links are required")
});

export default function UploadTeamInfo({ communityId, teamId, refetch }) {
  // Form state
  const [formData, setFormData] = useState({
    shortDesc: "",
    desc: "",
    vision: "",
  });

  // Links state
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ Name: "", Link: "" });
  const [linkErrors, setLinkErrors] = useState({ Name: "", Link: "" });

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
    shortDesc: { current: 0, max: 80 },
    desc: { current: 0, max: 325 },
    vision: { current: 0, max: 325 },
    linkName: { current: 0, max: 255 },
    linkUrl: { current: 0, max: 255 }
  });

  // Update character counts
  useEffect(() => {
    setCharCounts(prev => ({
      ...prev,
      shortDesc: { ...prev.shortDesc, current: formData.shortDesc.length },
      desc: { ...prev.desc, current: formData.desc.length },
      vision: { ...prev.vision, current: formData.vision.length },
      linkName: { ...prev.linkName, current: newLink.Name.length },
      linkUrl: { ...prev.linkUrl, current: newLink.Link.length }
    }));
  }, [formData, newLink]);

  // Validate form on change
  useEffect(() => {
    const validateForm = async () => {
      try {
        await teamInfoSchema.validate(
          { ...formData, links },
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
  }, [formData, links]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setTouchedFields(prev => ({ ...prev, [id]: true }));
  };

  const handleLinkChange = (e) => {
    const { value, name } = e.target;
    setNewLink(prev => ({ ...prev, [name]: value }));
    setLinkErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateLink = async () => {
    try {
      await yup.object({
        Name: yup.string().required(),
        Link: yup.string().required().url()
      }).validate(newLink);
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
      setLinkErrors(errors);
      return false;
    }
  };

  const addLink = async () => {
    const isValid = await validateLink();
    if (isValid) {
      setLinks(prev => [...prev, newLink]);
      setNewLink({ Name: "", Link: "" });
    }
  };

  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}`;

      const requestData = {
        Vision: formData.vision,
        DescShort: formData.shortDesc,
        Desc: formData.desc,
        MediaLinks: links
      };

      await axios.patch(url, requestData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
      refetch();
    } catch (error) {
      const errorMsg = error.response?.data?.Message ||
        error.message ||
        "Failed to update team info";
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
        className={`${styles.charCounter} ${
          isNearLimit ? styles.nearLimit : ""
        } ${isOverLimit ? styles.overLimit : ""}`}
      >
        {current}/{max}
      </span>
    );
  };

  return (
    <section className={styles.UploadTeamInfo}>
      <h1>Team Information</h1>

      <form className={styles.infoSection} onSubmit={handleSubmit}>
        {/* Team Info Section */}
        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="shortDesc">Short Description</label>
            {renderCharCounter('shortDesc')}
          </div>
          <textarea
            id="shortDesc"
            rows="2"
            placeholder="Brief description of your team (max 80 characters)"
            value={formData.shortDesc}
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, shortDesc: true }))}
            className={getFieldError("shortDesc") ? styles.errorInput : ""}
          />
          {getFieldError("shortDesc") && (
            <span className={styles.errorText}>{getFieldError("shortDesc")}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="desc">Description</label>
            {renderCharCounter('desc')}
          </div>
          <textarea
            id="desc"
            rows="5"
            placeholder="Detailed description of your team (max 325 characters)"
            value={formData.desc}
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, desc: true }))}
            className={getFieldError("desc") ? styles.errorInput : ""}
          />
          {getFieldError("desc") && (
            <span className={styles.errorText}>{getFieldError("desc")}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="vision">Our Vision</label>
            {renderCharCounter('vision')}
          </div>
          <textarea
            id="vision"
            rows="4"
            placeholder="Your team's vision and goals (max 325 characters)"
            value={formData.vision}
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, vision: true }))}
            className={getFieldError("vision") ? styles.errorInput : ""}
          />
          {getFieldError("vision") && (
            <span className={styles.errorText}>{getFieldError("vision")}</span>
          )}
        </div>

        {/* Links Section */}
        <div className={styles.formGroup}>
          <label>Social Links</label>
          <div className={styles.linkInputs}>
            <div className={styles.linkInputGroup}>
              <div className={styles.labelWrapper}>
                <span className={styles.subLabel}>Platform</span>
                {renderCharCounter('linkName')}
              </div>
              <input
                type="text"
                name="Name"
                placeholder="e.g. Twitter, Facebook"
                value={newLink.Name}
                onChange={handleLinkChange}
                className={linkErrors.Name ? styles.errorInput : ""}
              />
              {linkErrors.Name && (
                <span className={styles.errorText}>{linkErrors.Name}</span>
              )}
            </div>
            <div className={styles.linkInputGroup}>
              <div className={styles.labelWrapper}>
                <span className={styles.subLabel}>URL</span>
                {renderCharCounter('linkUrl')}
              </div>
              <input
                type="url"
                name="Link"
                placeholder="https://example.com"
                value={newLink.Link}
                onChange={handleLinkChange}
                className={linkErrors.Link ? styles.errorInput : ""}
              />
              {linkErrors.Link && (
                <span className={styles.errorText}>{linkErrors.Link}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className={styles.addLinkButton}
            onClick={addLink}
            disabled={!newLink.Name || !newLink.Link}
          >
            Add Link +
          </button>

          {links.length > 0 && (
            <div className={styles.linksList}>
              {links.map((link, index) => (
                <div key={index} className={styles.linkItem}>
                  <span className={styles.linkPlatform}>{link.Name}</span>
                  <a
                    href={link.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkUrl}
                  >
                    {link.Link}
                  </a>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => removeLink(index)}
                    aria-label={`Remove ${link.Name} link`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {formErrors.links && (
            <span className={styles.errorText}>{formErrors.links}</span>
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
                Saving Changes...
              </>
            ) : (
              "Save Changes"
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
                  <span>Team information updated successfully!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}