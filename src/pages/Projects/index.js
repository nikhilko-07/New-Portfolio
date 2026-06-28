import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";

const CATEGORIES = ["All"];

const PROJECTS_DATA = [{
  id: 1,
  title: "Social Media Application",
  desc: "A full-featured social media platform using MERN stack featuring real-time messaging with Socket.io, optimized database queries with indexing and aggregation pipelines",
  tech: ["MongoDB", "Express.js", "React", "Node.js", "Socket.io", "Redis"],
  category: "Social Media",
  image: "https://res.cloudinary.com/dnn6i8po1/image/upload/v1782648185/1763200306201_wvbilv.jpg",
},
  {
    id: 2,
    title: "Nodemailer",
    desc: "Enterprise-grade email automation system built with MERN stack, featuring Nodemailer SMTP integration for transactional emails.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Nodemailer", "SMTP",],
    category: "AI",
    image: "https://res.cloudinary.com/dnn6i8po1/image/upload/v1782648036/Screenshot_2026-06-26_214225_jmflev.png",
},
  {
    id: 3,
    title: "WebRTC Conference",
    desc: "Real-time video conferencing platform using WebRTC, Socket.io, and MERN stack. Features include HD video/audio calling, screen sharing, chat messaging.",
    tech: ["MongoDB", "React", "Node.js", "WebRTC", "Socket.io", "PeerJS"],
    category: "Video Conferencing",
    image: "https://res.cloudinary.com/dnn6i8po1/image/upload/v1782648129/1739700214034_jdt8si.jpg",
  }

];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  
  const trackRef = useRef(null);

  // Filter projects based on active selection
  const filteredProjects = PROJECTS_DATA.filter(
    (proj) => activeFilter === "All" || proj.category === activeFilter
  );

  // Check scroll position to show/hide prev and next buttons
  const checkScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setShowPrevBtn(scrollLeft > 10);
      setShowNextBtn(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handlePrev = () => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.clientWidth;
      trackRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.clientWidth;
      trackRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", checkScroll);
      // Run once initially to check buttons state
      setTimeout(checkScroll, 100);
    }
    return () => {
      if (track) {
        track.removeEventListener("scroll", checkScroll);
      }
    };
  }, [filteredProjects]);

  // Reset scroll and recheck when filter changes
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
      setTimeout(checkScroll, 100);
    }
  }, [activeFilter]);

  return (
    <div className={styles.projectsSlideWrapper}>
      {/* Header Area with Title & Action Controls */}
      <div className={styles.sectionHeader}>
        <div>
          <span className="about-subtitle">My Work</span>
          <h2 className="about-title">Featured Projects</h2>
        </div>
        
        <div className={styles.headerActions}>
          {/* Category Tabs */}
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterTab} ${
                  activeFilter === cat ? styles.activeFilterTab : ""
                }`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              onClick={handlePrev}
              disabled={!showPrevBtn}
              aria-label="Previous Project"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              className={styles.navButton}
              onClick={handleNext}
              disabled={!showNextBtn}
              aria-label="Next Project"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Snap-Scroll Carousel Track */}
      <div className={styles.carouselContainer}>
        <div ref={trackRef} className={styles.carouselTrack}>
          {filteredProjects.map((proj) => (
            <div key={proj.id} className={styles.projectCard}>
              {/* Image with glow link */}
              <div className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className={styles.projectImage} 
                  src={proj.image} 
                  alt={proj.title} 
                />
                <div className={styles.imageOverlay} />
                <div className={styles.linkButton}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </div>
              </div>

              {/* Content Area */}
              <div className={styles.cardContent}>
                <div>
                  <h3 className={styles.projectTitle}>{proj.title}</h3>
                  <p className={styles.projectDesc}>{proj.desc}</p>
                </div>
                <div className={styles.projectTech}>
                  {proj.tech.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.techTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
