import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Wrapper from "../wrapper";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import ApplePreloader from "../components/ApplePreloader";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isIntroLoaded, setIsIntroLoaded] = useState(false);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef(0);

  const isIntroLoadedRef = useRef(false);

  useEffect(() => {
    isIntroLoadedRef.current = isIntroLoaded;
  }, [isIntroLoaded]);

  const triggerTransition = (nextIndex) => {
    if (!isIntroLoadedRef.current) return; // Ignore input until intro finishes
    if (nextIndex < 0 || nextIndex >= 5) return; // 5 slides total (Hero, About, Skills, Projects, and Contact)
    console.log("[Slider] Transitioning to index:", nextIndex);
    isTransitioningRef.current = true;
    setActiveIndex(nextIndex);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 900); // matching 0.8s CSS transition + small buffer
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isIntroLoadedRef.current) return;
      if (Math.abs(e.deltaY) < 10) return; // lower threshold for responsive scrolling
      if (isTransitioningRef.current) return;

      if (e.deltaY > 0) {
        if (activeIndex < 4) {
          triggerTransition(activeIndex + 1);
        }
      } else {
        if (activeIndex > 0) {
          triggerTransition(activeIndex - 1);
        }
      }
    };

    const handleTouchStart = (e) => {
      if (!isIntroLoadedRef.current) return;
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isIntroLoadedRef.current) return;
      if (isTransitioningRef.current) return;
      const touchEnd = e.touches[0].clientY;
      const diff = touchStartRef.current - touchEnd;

      if (Math.abs(diff) < 50) return;

      if (diff > 0) {
        if (activeIndex < 4) {
          triggerTransition(activeIndex + 1);
        }
      } else {
        if (activeIndex > 0) {
          triggerTransition(activeIndex - 1);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (!isIntroLoadedRef.current) return;
      if (isTransitioningRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        if (activeIndex < 4) {
          triggerTransition(activeIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        if (activeIndex > 0) {
          triggerTransition(activeIndex - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, isIntroLoaded]);

  const getSlideClass = (index) => {
    if (index === activeIndex) return "slide-active";
    if (index < activeIndex) return "slide-prev";
    return "slide-next";
  };

  return (
    <Wrapper activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
      <Head>
        <title>Nikhil Kohli | Full Stack Developer</title>
        <meta name="description" content="Portfolio of Nikhil Kohli - Full Stack Developer" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>

      <ApplePreloader onExitStart={() => setIsIntroLoaded(true)} onComplete={() => setIsIntroLoaded(true)} />

      <div className={`slider-container ${isIntroLoaded ? "intro-loaded" : "intro-loading"}`}>
        
        {/* ==========================================
              Slide 1: Home / Hero
        ========================================== */}
        <section className={`slide-section slide-home ${getSlideClass(0)}`}>
          <div className={`hero ${isIntroLoaded ? "hero-revealed" : "hero-hidden"}`}>
            
            {/* Left Social */}
            <div className="left-social">
              <span onClick={() => window.open("https://instagram.com/nikhilko_07", "_blank")} title="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </span>
              <span onClick={() => window.open("https://x.com/NikhilKo_07", "_blank")} title="Twitter (X)">
                <FontAwesomeIcon icon={faTwitter} />
              </span>
              <span onClick={() => window.open("https://www.linkedin.com/in/nikhil-kohli-443a06325", "_blank")} title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </span>
              <span onClick={() => window.open("https://github.com/nikhilko-07", "_blank")} title="GitHub">
                <FontAwesomeIcon icon={faGithub} />
              </span>
              <span onClick={() => window.open("https://leetcode.com/u/jhy9ZoHyV9", "_blank")} title="LeetCode">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" style={{ display: "block" }}>
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.8 9.8a1.375 1.375 0 0 0 0 1.956l.08.08a1.368 1.368 0 0 0 1.96 0L14.5 2.5l7.007 7.007c-.453.513-1.077.85-1.782.906l-.08.007h-8.084a1.374 1.374 0 0 0-1.374 1.373v.077a1.37 1.37 0 0 0 1.374 1.374h8.084c.73 0 1.385-.4 1.79-.988l.08-.08 1.326-1.327a1.376 1.376 0 0 0 0-1.956L14.453.414a1.368 1.368 0 0 0-.97-.414zM8.513 14.5a1.374 1.374 0 0 0-1.374 1.373v.077a1.37 1.37 0 0 0 1.374 1.374H16.6a1.374 1.374 0 0 0 1.374-1.373v-.077a1.37 1.37 0 0 0-1.374-1.374H8.513z" />
                </svg>
              </span>
            </div>

            {/* Center */}
            <div className="hero-content">
              <span className="iam">I AM</span>
              <h1 className="title">NIKHIL</h1>
              <span className="designation">SOFTWARE ENGINEER</span>
            </div>

            {/* Right */}
            <div 
              className="scroll-text" 
              onClick={() => triggerTransition(1)} 
              style={{ cursor: "pointer" }}
            >
              NIKHIL KOHLI
            </div>
          </div>
        </section>

        {/* ==========================================
              Slide 2: About Page
        ========================================== */}
        <section className={`slide-section slide-about ${getSlideClass(1)}`}>
          <About />
        </section>

        <section className={`slide-section slide-skills ${getSlideClass(2)}`}>
          <Skills />
        </section>

        <section className={`slide-section slide-projects ${getSlideClass(3)}`}>
          <Projects />
        </section>

        <section className={`slide-section slide-contact ${getSlideClass(4)}`}>
          <Contact />
        </section>

      </div>
    </Wrapper>
  );
}
