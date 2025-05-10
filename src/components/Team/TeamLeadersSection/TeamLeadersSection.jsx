/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import styles from './TeamLeadersSection.module.css';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Cache for storing already loaded images to prevent duplicate requests
const imageCache = new Map();

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  return `${baseUrl}/api${imgPath}`;
};

// Format date to display month and year
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Component to handle profile image loading with authorization
const ProfileImage = ({ photoPath, userName }) => {
  const [displayImage, setDisplayImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Method to fetch preview image with axios
  const fetchProfileImage = async (imagePath) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!imagePath) {
        setDisplayImage('');
        setIsLoading(false);
        return;
      }

      const fullUrl = getFullImageUrl(imagePath);

      // Check if this image is already in our cache
      if (imageCache.has(fullUrl)) {
        setDisplayImage(imageCache.get(fullUrl));
        setIsLoading(false);
        return;
      }

      if (fullUrl.startsWith('http')) {
        const response = await axios.get(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'
        });

        const imageUrl = URL.createObjectURL(response.data);
        // Store in cache for future use
        imageCache.set(fullUrl, imageUrl);
        setDisplayImage(imageUrl);
      } else {
        setDisplayImage(fullUrl);
      }
    } catch (error) {
      console.log(error);
      setDisplayImage('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (photoPath) {
      fetchProfileImage(photoPath);
    } else {
      setDisplayImage('');
      setIsLoading(false);
    }
  }, [photoPath]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (displayImage && displayImage.startsWith('blob:') && !Array.from(imageCache.values()).includes(displayImage)) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [displayImage]);

  if (isLoading) {
    return (
      <div className={styles.avatarPlaceholder}>
        <div className={styles.avatarLoading}></div>
      </div>
    );
  }

  return displayImage ? (
    <img
      src={displayImage}
      alt={userName}
      className={styles.leaderImage}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/placeholder.webp";
      }}
    />
  ) : (
    <div className={styles.avatarPlaceholder}>
      {userName?.charAt(0) || '?'}
    </div>
  );
};

const TeamLeadersSection = ({ leaders }) => {
  if (!leaders || leaders.length === 0) {
    return null;
  }

  // Sort leaders by date - current leaders first, then by most recent
  const sortedLeaders = [...leaders].sort((a, b) => {
    // Current leaders first
    if (a.IsActive && !b.IsActive) return -1;
    if (!a.IsActive && b.IsActive) return 1;
    
    // Then sort by start date (most recent first)
    const dateA = new Date(a.StartDate || 0);
    const dateB = new Date(b.StartDate || 0);
    return dateB - dateA;
  });

  return (
    <section className={styles.leadersSection}>
      <h2 className={styles.sectionTitle}>Leader History</h2>
      
      <div className={styles.leadersList}>
        {sortedLeaders.map((leader, index) => (
          <div key={index} className={styles.leaderItem}>
            <div className={styles.leaderProfile}>
              <div className={styles.leaderImageWrapper}>
                <ProfileImage 
                  photoPath={leader.ProfilePhoto} 
                  userName={leader.FirstName} 
                />
              </div>
              
              <div className={styles.leaderDetails}>
                <h3 className={styles.leaderName}>{`${leader.FirstName} ${leader.LastName || ''}`}</h3>
                <div className={styles.leaderTenure}>
                  <i className="far fa-calendar-alt"></i>
                  <span>
                    {formatDate(leader.StartDate)}
                    {leader.IsActive ? ' - Present' : leader.EndDate ? ` - ${formatDate(leader.EndDate)}` : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.leaderStatus}>
              {leader.IsActive ? (
                <span className={styles.currentLeaderBadge}>
                  <i className="fas fa-circle"></i> Current Leader
                </span>
              ) : (
                <span className={styles.pastLeaderBadge}>
                  <i className="far fa-circle"></i> Past Leader
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamLeadersSection;


