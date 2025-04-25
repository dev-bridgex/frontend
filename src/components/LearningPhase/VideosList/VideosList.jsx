import styles from "./VideosList.module.css";
import { useState } from 'react';
import Video from './Components/Video/Video';

// Data for accordion items
const accordionItems = [
  {
    id: "collapseOne",
    title: "Intro Web Development Fundamentals",
    totalHours: "12 hours total",
    totalVideos: "24 videos",
    videos: [
      {
        id: 1,
        thumbnail: "/videoThumbnal.png",
        title: "Getting Started with Web Development",
        duration: "10:25",
        completed: true,
        videoUrl: "/videos/intro-web-dev.mp4"
      },
      {
        id: 2,
        thumbnail: "/videoThumbnal.png",
        title: "HTML Basics",
        duration: "15:40",
        completed: false,
        videoUrl: "/videos/html-basics.mp4"
      }
    ],
    resources: [
      {
        id: 1,
        icon: "/icons/file.svg",
        title: "Course syllabus",
        size: "PDF 2.4 MB"
      },
      {
        id: 2,
        icon: "/icons/file.svg",
        title: "HTML Cheat Sheet",
        size: "PDF 1.2 MB"
      }
    ]
  },
  {
    id: "collapseTwo",
    title: "Advanced Web Development",
    totalHours: "15 hours total",
    totalVideos: "30 videos",
    videos: [
      {
        id: 3,
        thumbnail: "/videoThumbnal.png",
        title: "CSS Advanced Techniques",
        duration: "18:20",
        completed: false,
        videoUrl: "/videos/css-advanced.mp4"
      },
      {
        id: 4,
        thumbnail: "/videoThumbnal.png",
        title: "JavaScript Fundamentals",
        duration: "22:15",
        completed: false,
        videoUrl: "/videos/js-fundamentals.mp4"
      }
    ],
    resources: [
      {
        id: 3,
        icon: "/icons/file.svg",
        title: "Advanced Syllabus",
        size: "PDF 3.1 MB"
      },
      {
        id: 4,
        icon: "/icons/file.svg",
        title: "JS Cheat Sheet",
        size: "PDF 1.5 MB"
      }
    ]
  }
];

export default function VideosList() {
  const [openAccordion, setOpenAccordion] = useState(accordionItems[0].id);
  const [currentVideo, setCurrentVideo] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleWatchNow = (video, resources) => {
    setCurrentVideo({
      ...video,
      resources: resources
    });
  };

  const handleCloseVideo = () => {
    setCurrentVideo(null);
  };

  return (
    <>
      {/* VideosListSection */}
      <section className={`${styles.videosListSection}`}>
        {/* videosListContainer */}
        <div className={`${styles.videosListContainer}`}>
          {/* accordion */}
          <div className="accordion" id="accordionExample">
            {accordionItems.map((item) => (
              /* accordionItem */
              <div key={item.id} className={`accordion-item ${styles.accordionItem} overflow-hidden`}>
                <h2 className={`${styles.accordionHeader} overflow-hidden`}>
                  <button
                    className={`accordion-button ${openAccordion !== item.id ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={openAccordion === item.id}
                    aria-controls={item.id}
                  >
                    <div className={`${styles.listHeader}`}>
                      <h3 className={`${styles.title}`}>{item.title}</h3>

                      {/* courseDetails */}
                      <div className={`${styles.courseDetails}`}>
                        {/* courseDuration */}
                        <div className={`${styles.courseDuration}`}>
                          <img src="/icons/hour.svg" alt="Duration icon" />
                          <span>{item.totalHours}</span>
                        </div>

                        {/* contentCount */}
                        <div className={`${styles.contentCount}`}>
                          <img src="/icons/totalVideoIcon.svg" alt="Video count icon" />
                          <span>{item.totalVideos}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>

                <div
                  id={item.id}
                  className={`accordion-collapse collapse ${openAccordion === item.id ? 'show' : ''}`}
                  aria-labelledby={`heading${item.id}`}
                >
                  {item.videos.map(video => (
                    <div key={video.id} className={`accordion-body ${styles.accordionBody} border`}>
                      {/* videoCardSwipper */}
                      <div className={`${styles.videoCardSwipper}`}>
                        {/* videoCardContainer */}
                        <div className={`${styles.videoCardContainer}`}>
                          <img className={`${styles.thumbnail}`} src={video.thumbnail} alt="Video thumbnail" />

                          {/* videoInfo */}
                          <div className={`${styles.videoInfo}`}>
                            <h4 className={`${styles.videoTitle}`}>{video.title}</h4>

                            <div >
                              {/* videoDuration */}
                              <div className={`${styles.videoDurationWrapper}`}>
                                <img src="/icons/hour.svg" alt="Duration icon" />
                                <span>{video.duration}</span>
                              </div>

                              {/* completionStatusWrapper */}
                              {video.completed && (
                                <div className={`${styles.completionStatusWrapper}`}>
                                  <img src="/public/icons/completed.svg" alt="Completed icon" />
                                  <span>Completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* watchVideoButton */}
                        <button
                          className={`${styles.watchVideoButton}`}
                          onClick={() => handleWatchNow(video, item.resources)}
                        >
                          <img src="/icons/whiteVideoIcon.svg" alt="Watch icon" />
                          Watch Now
                        </button>

                      </div>
                    </div>
                  ))}

                  {/* accordionFooter */}
                  <div className={`${styles.accordionFooter}`}>
                    {/* footerTitle */}
                    <h4 className={`${styles.footerTitle}`}>Resources</h4>

                    {/* resourcesWrapper */}
                    <div className={`${styles.resourcesWrapper} `}>
                      {item.resources.map(resource => (
                        /* resource */
                        <div key={resource.id} className={`${styles.resource}`}>
                          {/* resourceContainer */}
                          <div className={`${styles.resourceContainer}`}>
                            <img className={`${styles.logo}`} src={resource.icon} alt="Resource icon" />

                            {/* resourceInfo */}
                            <div className={`${styles.resourceInfo}`}>
                              <h6 className={`${styles.resourceTitle}`}>{resource.title}</h6>
                              <span>{resource.size}</span>
                            </div>
                          </div>

                          <img
                            className="cursorPointer"
                            src="/icons/download.svg"
                            alt="Download icon"
                          />
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

      {/* Video Player Modal */}
      {currentVideo && (
        <Video
          videoData={currentVideo}
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
}
