import { useState, useEffect } from "react";
import styles from "./ApplePreloader.module.css";

const GREETINGS = [
  { text: "Hello" },          // English
  { text: "नमस्ते" },        // Hindi
  { text: "Hola" },           // Spanish
  { text: "Bonjour" },        // French
  { text: "Ciao" },           // Italian
  { text: "こんにちは" },     // Japanese
  { text: "Olá" },            // Portuguese
  { text: "你好" },           // Chinese
  { text: "Hallo" },          // German
  { text: "مرحبا" },          // Arabic
  { text: "Привет" },         // Russian
  { text: "안녕하세요" }      // Korean
];

export default function ApplePreloader({ onComplete, onExitStart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scrolling while words are cycling
    document.body.style.overflow = "hidden";

    const blockInteraction = (e) => {
      if (e.type === "keydown") {
        // Only block slide navigation keys during intro, allow F5/Ctrl+R reloads
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("wheel", blockInteraction, { passive: false });
    window.addEventListener("touchmove", blockInteraction, { passive: false });
    window.addEventListener("keydown", blockInteraction, { passive: false });

    const unbindBlockers = () => {
      window.removeEventListener("wheel", blockInteraction);
      window.removeEventListener("touchmove", blockInteraction);
      window.removeEventListener("keydown", blockInteraction);
      document.body.style.overflow = "";
    };

    const WORD_DURATION = 185; // ms per greeting - exact Apple setup rhythm

    // Interval to cycle through the greetings
    const greetingInterval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < GREETINGS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(greetingInterval);
          return prev;
        }
      });
    }, WORD_DURATION);

    // Total cycle time for the 12 languages
    const totalCycleTime = GREETINGS.length * WORD_DURATION + 100;

    // Trigger curtain slide-up exit & IMMEDIATELY unbind blockers & enable user inputs!
    const exitTimeout = setTimeout(() => {
      setIsExiting(true);
      unbindBlockers(); // Unbind event blockers immediately when exit starts
      if (onExitStart) onExitStart();
      if (onComplete) onComplete();
    }, totalCycleTime);

    // Complete intro sequence and unmount preloader element after curtain lifts
    const completeTimeout = setTimeout(() => {
      setIsDone(true);
    }, totalCycleTime + 1500);

    return () => {
      clearInterval(greetingInterval);
      clearTimeout(exitTimeout);
      clearTimeout(completeTimeout);
      unbindBlockers();
    };
  }, [onComplete, onExitStart]);

  if (isDone) return null;

  return (
    <div className={`${styles.preloaderContainer} ${isExiting ? styles.exiting : ""}`}>
      {/* Centered greeting text container with exit fade */}
      <div className={`${styles.greetingWrapper} ${isExiting ? styles.exitingWrapper : ""}`}>
        <h1 key={currentIndex} className={styles.greetingText}>
          {GREETINGS[currentIndex].text}
        </h1>
      </div>

      {/* Curved SVG Liquid Slide Up Exit */}
      <div className={styles.svgWrapper}>
        <svg className={styles.svgCurve} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="#000000" 
            d="M0,0 L1440,0 L1440,160 Q720,320 0,160 Z"
          />
        </svg>
      </div>
    </div>
  );
}
