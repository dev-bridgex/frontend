/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProfilePhotoSection.module.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  return `${baseUrl}/api${imgPath}`;
};

export default function ProfilePhotoSection({
  profileData,
  loading,
  onFileChange,
  onUploadPhoto,
  onDeletePhoto,
  selectedFile
}) {
  const [displayImage, setDisplayImage] = useState('');
  const [localPreview, setLocalPreview] = useState('');

  // Method to fetch preview image with axios
  const fetchPreviewImage = async (imagePath) => {
    try {
      const token = localStorage.getItem('token'); 
      if (!imagePath) {
        setDisplayImage('');
        return;
      }
      
      const fullUrl = getFullImageUrl(imagePath);
      if (fullUrl.startsWith('http')) {
        const response = await axios.get(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'
        });
        
        const imageUrl = URL.createObjectURL(response.data);
        setDisplayImage(imageUrl);
      } else {
        setDisplayImage(fullUrl);
      }
    } catch (error) {
      console.error('Error fetching preview image:', error);
      setDisplayImage(''); 
    }
  };

  // Handle file selection and create preview
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      onFileChange(e);
    }
  };

  useEffect(() => {
    if (profileData?.ProfilePhoto) {
      fetchPreviewImage(profileData.ProfilePhoto);
    } else {
      setDisplayImage('');
    }
  }, [profileData?.ProfilePhoto]);

  // Cleanup preview URLs when component unmounts or when new preview is created
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
      if (displayImage && displayImage.startsWith('blob:')) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [localPreview, displayImage]);

  return (
    <div className={styles.profilePhotoSection}>
      <div className={styles.photoContainer}>
        {localPreview ? (
          <img
            src={localPreview}
            alt="Preview"
            className={styles.profilePhoto}
          />
        ) : displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className={styles.profilePhoto}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.webp";
            }}
          />
        ) : (
          <div className={styles.photoPlaceholder}>
            {profileData?.FirstName?.charAt(0)}{profileData?.LastName?.charAt(0)}
          </div>
        )}
      </div>

      <div className={styles.photoActions}>
        <label className={styles.fileInputLabel}>
          <input
            type="file"
            onChange={handleLocalFileChange}
            accept="image/*"
            className={styles.fileInput}
          />
          <i className="fas fa-camera"></i> Choose Photo
        </label>

        {selectedFile && (
          <button
            onClick={() => {
              onUploadPhoto();
              setLocalPreview(''); // Clear preview after upload
            }}
            className={styles.uploadButton}
            disabled={loading}
          >
            <i className="fas fa-upload"></i>
            {loading ? 'Uploading...' : 'Upload Photo'}
          </button>
        )}

        {profileData?.ProfilePhoto && (
          <button
            onClick={() => {
              onDeletePhoto();
              setLocalPreview(''); // Clear preview after delete
              setDisplayImage(''); // Clear display image after delete
            }}
            className={styles.deletePhotoButton}
            disabled={loading}
          >
            <i className="fas fa-trash"></i>
            {loading ? 'Deleting...' : 'Delete Photo'}
          </button>
        )}
      </div>
    </div>
  );
}
