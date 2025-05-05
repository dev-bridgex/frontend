/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import styles from "./VideosList.module.css";
import UpdateSectionModal from "../UpdateSectionModal/UpdateSectionModal";
import UploadVideoModal from "../UploadVideoModal/UploadVideoModal";
import VideoPlayerModal from "./Components/VideoPlayerModal/VideoPlayerModal";
import EditVideoModal from "../EditVideoModal/EditVideoModal";
import AddResource from "../AddResource/AddResource";
import EditResource from "../EditResource/EditResource";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function VideosList({ sections, CanModify, communityId, teamId, subTeamId, refetch }) {

  // State management
  const [openAccordion, setOpenAccordion] = useState(sections[0]?.Id || null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(null); // Track which video is being updated
  const [completingVideo, setCompletingVideo] = useState(null); // Track which video is being marked as complete

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (data) {
      if (type === 'videoPlayer' || type === 'editVideo') {
        setCurrentVideo(data);
      } else if (type === 'updateSection' || type === 'uploadVideo' || type === 'uploadResource' || type === 'editResource') {
        setCurrentSection(data);
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentVideo(null);
    setCurrentSection(null);
  };

  const handleDeleteSection = async (sectionId) => {
    if (isDeleting) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        await axios.delete(
          `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        toast.success('Section deleted successfully', { position: "top-center" });
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.Message || error.message || 'Failed to delete section', { position: "top-center" });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownloadResource = async (resource) => {
    try {
      const downloadUrl = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${openAccordion}/resource/${resource.Id}`;

      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'accept': '*/*'
        }
      });

      const fileExtension = resource.File.split('.').pop().toLowerCase();
      let mimeType;

      switch (fileExtension) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'doc':
        case 'docx':
          mimeType = 'application/msword';
          break;
        case 'xls':
        case 'xlsx':
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'ppt':
        case 'pptx':
          mimeType = 'application/vnd.ms-powerpoint';
          break;
        case 'txt':
          mimeType = 'text/plain';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      const blob = new Blob([response.data], { type: mimeType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileName = resource.Name.includes('.') ?
        resource.Name :
        `${resource.Name}.${fileExtension}`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success('Resource downloaded successfully', { position: "top-center" });
    } catch (error) {
      toast.error(error.response?.data?.Message || error.message || 'Failed to download resource', { position: "top-center" });
    }
  };

  const formatVideoDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateSectionDuration = (videos) => {
    const totalSeconds = videos.reduce((sum, video) => {
      return sum + parseFloat(video.Duration || 0);
    }, 0);

    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins} min ${secs} sec`;
  };

  const handleDeleteVideo = async (sectionId, videoId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover this video!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video/${videoId}`;

        await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });

        toast.success('Video deleted successfully', { position: "top-center" });
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.Message || 'Failed to delete video', { position: "top-center" });
      }
    }
  };

  // New function to update watch progress
  const updateWatchProgress = async (sectionId, videoId, duration) => {
    try {
      setUpdatingProgress(`${sectionId}-${videoId}`);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video/${videoId}/progress`;

      await axios.post(url, { Duration: duration }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      });

      toast.success('Progress updated successfully', { position: "top-center" });
      refetch();

    } catch (error) {
      toast.error(error.response?.data?.Message || error.message || 'Failed to update progress', { position: "top-center" });
    } finally {
      setUpdatingProgress(null);
    }
  };

  // Function to handle progress adjustment
  const handleAdjustProgress = (sectionId, video, amount) => {
    const currentDuration = parseFloat(video.WatchedDuration || 0);
    const maxDuration = parseFloat(video.Duration || 0);

    let newDuration = currentDuration + amount;
    // Ensure within bounds
    newDuration = Math.max(0, Math.min(newDuration, maxDuration));

    if (newDuration !== currentDuration) {
      updateWatchProgress(sectionId, video.Id, newDuration);
    }
  };

  // Function to mark video as complete
  const markAsComplete = (sectionId, video) => {
    const maxDuration = parseFloat(video.Duration || 0);
    updateWatchProgress(sectionId, video.Id, maxDuration);
  };

  // New function to mark video as complete
  const markVideoAsComplete = async (sectionId, videoId, isCompleted) => {
    try {
      setCompletingVideo(`${sectionId}-${videoId}`);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/video/${videoId}/complete`;

      await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      toast.success(isCompleted ? 'Video marked as complete' : 'Video marked as incomplete', { position: "top-center" });
      refetch();

    } catch (error) {
      toast.error(error.response?.data?.Message || error.message || 'Failed to update completion status', { position: "top-center" });
    } finally {
      setCompletingVideo(null);
    }
  };

  // Function to calculate percentage
  const calculatePercentage = (watched, total) => {
    const watchedDuration = parseFloat(watched || 0);
    const totalDuration = parseFloat(total || 1);
    return Math.min(Math.round((watchedDuration / totalDuration) * 100), 100);
  };

  const handleDeleteResource = async (sectionId, resourceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const url = `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/learningphase/section/${sectionId}/resource/${resourceId}`;


        await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });

        toast.success('Resource deleted successfully', { position: "top-center" });
        refetch();
      } catch (error) {

        toast.error(error.response?.data?.Message || 'Failed to delete resource', { position: "top-center" });
      }
    }
  };

  return (
    <>
      {/* Modals */}
      {modalType === 'updateSection' && currentSection && (
        <UpdateSectionModal
          show={true}
          onClose={closeModal}
          refetch={refetch}
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={currentSection.id}
          initialData={{
            name: currentSection.name,
            number: currentSection.number
          }}
        />
      )}

      {modalType === 'uploadVideo' && currentSection && (
        <UploadVideoModal
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={currentSection.id}
          refetch={refetch}
          onClose={closeModal}
        />
      )}

      {modalType === 'videoPlayer' && currentVideo && (
        <VideoPlayerModal
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={openAccordion}
          videoId={currentVideo.id}
          videoName={currentVideo.name}
          onClose={closeModal}
        />
      )}

      {modalType === 'editVideo' && currentVideo && (
        <EditVideoModal
          show={true}
          onClose={closeModal}
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={openAccordion}
          videoId={currentVideo.id}
          initialData={{
            name: currentVideo.name,
            desc: currentVideo.desc
          }}
          refetch={refetch}
        />
      )}

      {/* Add the new AddResource modal */}
      {modalType === 'uploadResource' && currentSection && (
        <AddResource
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={currentSection.id}
          refetch={refetch}
          onClose={closeModal}
        />
      )}

      {modalType === 'editResource' && currentSection && (
        <EditResource
          communityId={communityId}
          teamId={teamId}
          subTeamId={subTeamId}
          sectionId={currentSection.id}
          resourceId={currentSection.resourceId}
          initialData={{
            name: currentSection.name
          }}
          refetch={refetch}
          onClose={closeModal}
        />
      )}

      {/* Main Content */}
      <section className={styles.videosListSection}>
        <div className={styles.videosListContainer}>
          <div className="accordion " id="accordionExample">
            {sections.map((section) => (
              <div key={section.Id} className={`accordion-item ${styles.accordionItem} overflow-hidden`}>
                <h2 className={`${styles.accordionHeader} overflow-hidden `}>
                  <div
                    className={`${styles.headerWrapper} accordion-button    ${openAccordion !== section.Id ? 'collapsed' : ''}`}
                    onClick={() => toggleAccordion(section.Id)}
                  >
                    <div className={`${styles.headerContent} `}>
                      <h3 className={styles.title}>{section.Name}</h3>
                      <div className={styles.courseDetails}>
                        <div className={styles.courseDuration}>
                          <img src="/icons/hour.svg" alt="Duration icon" />
                          <span>{calculateSectionDuration(section.Videos)} total</span>
                        </div>
                        <div className={styles.contentCount}>
                          <img src="/icons/totalVideoIcon.svg" alt="Video count icon" />
                          <span>{section.Videos.length} videos</span>
                        </div>
                      </div>
                    </div>

                    {CanModify && (
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.updateSectionBtn} ${styles.addVideoBtn}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('uploadVideo', {
                              id: section.Id,
                              name: section.Name,
                              number: section.Number
                            });
                          }}
                          title="Add new video"
                        >
                          <i className="fa-solid fa-video"></i>
                        </button>

                        <button
                          className={styles.updateSectionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('updateSection', {
                              id: section.Id,
                              name: section.Name,
                              number: section.Number
                            });
                          }}
                          title="Update section name"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>

                        <button
                          className={`${styles.updateSectionBtn} ${styles.deleteBtn}`}
                          title="Delete section"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.Id);
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-trash"></i>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </h2>

                <div
                  id={section.Id}
                  className={`accordion-collapse collapse ${openAccordion === section.Id ? 'show' : ''}`}
                >
                  {section?.Videos.map(video => (
                    <div key={video.Id} className={`accordion-body ${styles.accordionBody} border ${video.IsCompleted ? styles.completedVideo : ''}`}>
                      <div className={styles.videoCardSwipper}>
                        <div className={styles.videoCardContainer}>
                          <div className={styles.videoContentWrapper}>
                            <div className={styles.videoIconContainer}>
                              <div className={`${styles.videoIconCircle} ${video.IsCompleted ? styles.completedIcon : ''}`}>
                                <i className="fas fa-play"></i>
                              </div>
                            </div>
                            <div className={`${styles.videoInfo}`}>
                              <div className={`${styles.videoHeader}`}>
                                <h4 className={styles.videoTitle}>{video.Name}</h4>
                                {video.IsCompleted && (
                                  <div className={`${styles.completedBadge}`}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Completed</span>
                                  </div>
                                )}
                              </div>

                              <p className={styles.videoDesc}>{video.Desc}</p>
                              <div className={styles.videoMetadata}>
                                <div className={styles.videoDurationWrapper}>
                                  <img src="/icons/hour.svg" alt="Duration icon" />
                                  <span>{formatVideoDuration(video.Duration)}</span>
                                </div>
                                {video.WatchedDuration && parseFloat(video.WatchedDuration) > 0 && (
                                  <div className={styles.watchedDurationWrapper}>
                                    <i className="fas fa-play-circle"></i>
                                    <span>Watched: {formatVideoDuration(video.WatchedDuration)}</span>
                                    <span className={styles.watchPercentage}>
                                      ({calculatePercentage(video.WatchedDuration, video.Duration)}%)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className={styles.videoActionsContainer}>
                              {/* Progress controls - now moved to the right side */}
                              {CanModify && !video.IsCompleted && (
                                <div className={styles.progressControlsContainer}>
                                  <div className={styles.progressControlsButtons}>


                                    <button
                                      className={`${styles.progressButton} ${styles.incrementButton}`}
                                      onClick={() => handleAdjustProgress(section.Id, video, 30)}
                                      disabled={updatingProgress === `${section.Id}-${video.Id}` || parseFloat(video.WatchedDuration || 0) >= parseFloat(video.Duration || 0)}
                                      title="Increase watched time by 30 seconds"
                                    >
                                      <i className="fas fa-plus"></i>
                                      <span>30s</span>
                                    </button>

                                    <button
                                      className={`${styles.progressButton} ${styles.completeButton}`}
                                      onClick={() => markAsComplete(section.Id, video)}
                                      disabled={updatingProgress === `${section.Id}-${video.Id}`}
                                      title="Mark video as complete"
                                    >
                                      <i className="fas fa-check-circle"></i>
                                      <span>Complete</span>
                                    </button>
                                  </div>

                                  {updatingProgress === `${section.Id}-${video.Id}` && (
                                    <div className={styles.updatingIndicator}>
                                      <i className="fas fa-spinner fa-spin"></i>
                                      <span>Updating...</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Mark as complete checkbox - only show if not completed and not an admin */}
                              {!video.IsCompleted && !CanModify && (
                                <div className={styles.completionCheckbox}>
                                  <label className={styles.checkboxContainer}>
                                    <input
                                      type="checkbox"
                                      checked={false}
                                      onChange={() => markVideoAsComplete(section.Id, video.Id, true)}
                                      disabled={completingVideo === `${section.Id}-${video.Id}`}
                                    />
                                    <span className={styles.checkmark}></span>
                                    <span className={styles.checkboxLabel}>
                                      {completingVideo === `${section.Id}-${video.Id}` ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                      ) : (
                                        'Mark as complete'
                                      )}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Video action buttons */}
                              <div className={styles.videoActions}>
                                <button
                                  className={styles.watchVideoButton}
                                  onClick={() => openModal('videoPlayer', {
                                    id: video.Id,
                                    name: video.Name,
                                    desc: video.Desc
                                  })}
                                >
                                  <img src="/icons/whiteVideoIcon.svg" alt="Watch icon" />
                                  {video.IsCompleted ? 'Watch Again' : 'Watch Now'}
                                </button>
                                {CanModify && (
                                  <>
                                    <button
                                      className={styles.editVideoButton}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModal('editVideo', {
                                          id: video.Id,
                                          name: video.Name,
                                          desc: video.Desc
                                        });
                                      }}
                                      title="Edit video"
                                    >
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button
                                      className={styles.deleteVideoButton}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteVideo(section.Id, video.Id);
                                      }}
                                      title="Delete video"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className={`${styles.accordionFooter}  `}>
                    <div className={styles.resourcesHeader}>
                      <h4 className={styles.footerTitle}>Resources</h4>
                      {CanModify && (
                        <button
                          className={styles.uploadResourceBtn}
                          onClick={() => {
                            openModal('uploadResource', {
                              id: section.Id,
                              name: section.Name
                            });
                          }}
                          title="Upload new resource"
                        >
                          <i className="fa-solid fa-file-arrow-up"></i>
                          <span>Add Resource</span>
                        </button>
                      )}
                    </div>
                    <div className={`${styles.resourcesWrapper} `}>
                      {section?.Resources.map(resource => (
                        <div key={resource.Id} className={styles.resource}>
                          <div className={styles.resourceContainer}>
                            <img className={styles.logo} src="/icons/file.svg" alt="Resource icon" />
                            <div className={styles.resourceInfo}>
                              <h6 className={styles.resourceTitle}>{resource.Name}</h6>
                              <span>{resource.File.split('.').pop().toUpperCase()}</span>
                            </div>
                          </div>
                          <div className={styles.resourceActions}>
                            {CanModify && (
                              <>
                                <button
                                  className={styles.updateResourceButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('editResource', {
                                      id: section.Id,
                                      resourceId: resource.Id,
                                      name: resource.Name
                                    });
                                  }}
                                  title="Update resource"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={styles.deleteResourceButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteResource(section.Id, resource.Id);
                                  }}
                                  title="Delete resource"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </>
                            )}
                            <button
                              className={styles.downloadButton}
                              onClick={() => handleDownloadResource(resource)}
                            >
                              <img src="/icons/download.svg" alt="Download icon" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
