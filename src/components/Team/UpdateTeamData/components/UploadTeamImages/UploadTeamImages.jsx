/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import axios from 'axios';
import styles from './UploadTeamImages.module.css';

export default function UploadTeamImages({ teamId, communityId }) {

  const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/communities/${communityId}/teams/${teamId}/images`;

  // State management
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sizeWarning, setSizeWarning] = useState('');

  // Helper functions (same as community version but with team API endpoint)
  const getAuthToken = () => localStorage.getItem('token');

  const validateFiles = useCallback((files) => {
    const validFiles = [];
    let error = '';
    let warning = '';
    const oversizedFiles = [];

    Array.from(files).forEach(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        error = 'Only PNG, JPG, and WEBP files are allowed';
      } else if (!isValidSize) {
        oversizedFiles.push(file.name);
      } else if (selectedImages.length + validFiles.length >= 10) {
        error = 'Maximum 10 images allowed';
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      warning = `The following files exceed 5MB limit and won't be uploaded: ${oversizedFiles.join(', ')}`;
    }

    if (error) setUploadError(error);
    if (warning) setSizeWarning(warning);
    return validFiles;
  }, [selectedImages.length]);

  // Event handlers (same as community version)
  const handleFileSelect = useCallback((files) => {
    const validFiles = validateFiles(files);
    setSelectedImages(prev => [...prev, ...validFiles].slice(0, 10));
    setUploadError('');
  }, [validateFiles]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeSelectedImage = useCallback((index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      setUploadError('Please select at least one image');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    setSizeWarning('');

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append('file', image);

        await axios.post(API_BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setSelectedImages([]);
      setUploadSuccess(`${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''} uploaded successfully!`);
    } catch (error) {
      setUploadError(error.response?.data?.Message || error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${styles.uploadTeamImages}`}>
      {/* Header and drop zone (same as community version) */}
      <div className={styles.header}>
        <h4 className={styles.title}>Team Images</h4>
      </div>

      <div className={`${styles.uploadZone}`}>
        <label className={`${styles.teamBanner}`} htmlFor="teamBanner">
          <div
            className={`${styles.dropArea} ${isDragging ? styles.dragging : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            <div className={`${styles.uploadContent}`}>
              <svg className={styles.uploadIcon} viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <div className={styles.uploadTextContainer}>
                <p className={styles.uploadText}>Drag & drop images here</p>
                <p className={styles.uploadSubtext}>or click to browse files</p>
              </div>
              <p className={styles.fileRequirements}>Supports: JPG, PNG, WEBP • Max 5MB each</p>
            </div>
            <input
              type="file"
              id="teamBanner"
              className={`${styles.fileInput}`}
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </label>
      </div>

      {/* Status messages and image grid (same as community version) */}
      {uploadSuccess && <div className="alert alert-success py-2 mt-1 text-center">{uploadSuccess}</div>}
      {uploadError && <div className="alert alert-danger py-2 mt-1 text-center">{uploadError}</div>}
      {sizeWarning && (
        <div className="alert alert-warning py-2 mt-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle me-2" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 10.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>
          {sizeWarning}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className={`${styles.selectionSection}`}>
          <div className={`${styles.sectionHeader}`}>
            <h4 className={styles.sectionTitle}>Selected Images ({selectedImages.length})</h4>
            <button
              className={styles.clearAllBtn}
              onClick={() => setSelectedImages([])}
              disabled={isUploading}
            >
              Clear All
            </button>
          </div>

          <div className={`${styles.imageGrid}`}>
            {selectedImages.map((img, index) => (
              <div key={`selected-${index}`} className={`${styles.imageItem}`}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Selected ${index + 1}`}
                  className={`${styles.imageThumbnail}`}
                />
                <button
                  className={styles.removeImageBtn}
                  onClick={() => removeSelectedImage(index)}
                  disabled={isUploading}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            className={`${styles.uploadButton} ButtonStyle`}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              `Uploading ${selectedImages.length} Image${selectedImages.length !== 1 ? 's' : ''}...`
            ) : (
              `Upload ${selectedImages.length} Image${selectedImages.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}