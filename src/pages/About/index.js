import { useState } from "react";
import styles from "./style.module.css";

const EXPERIENCES = [
  {
    id: 1,
    role: "SDE-1",
    company: "OneTuza",
    period: "2026 - Present",
    description: "Architected modular design patterns in React.js and TypeScript, improving API latency by 35%.",
    skills: "React.js / TypeScript / Node.js / PostgreSQL / AWS"
  },
  {
    id: 2,
    role: "Full Stack Developer Intern",
    company: "OneTuza",
    period: "2026 - Present",
    description: "Worked on ONETUZA App - an application that helps users to find best places around them",
    skills: "React Native / TypeScript / Node.js / PostgreSQL / AWS"
  },
  {
    id: 3,
    role: "Full Stack Developer Intern",
    company: "UNMP",
    period: "2024 - 2025",
    description: "Developed scalable full-stack features, built RESTful APIs with Express.",
    skills: "React / Express / MongoDB / Redux / REST APIs"
  },

];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="about-slide-wrapper">
      {/* Left Column: Clean Bio Text */}
      <div className="about-content-block">
        <div>
          <span className="about-subtitle">Who I Am</span>
          <h2 className="about-title">Nikhil Kohli</h2>
        </div>
        <p className="about-description">
          I am a Full Stack Developer dedicated to crafting clean, high-performance web applications. I focus on simplicity, speed, and standard-compliant engineering. My goal is to build interfaces that feel light, work flawlessly, and elevate user experience.
        </p>
      </div>

      {/* Right Column: Minimal Chronological Timeline */}
      <div className="about-content-block">
        <div className={styles.timeline}>
          {EXPERIENCES.map((exp, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={exp.id}
                className={`${styles.timelineItem} ${isActive ? styles.activeItem : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                {/* Bullet Dot */}
                <div className={styles.timelineDot} />

                {/* Content */}
                <div className={styles.timelineDate}>{exp.period}</div>
                <h3 className={styles.timelineTitle}>
                  {exp.role} <span className={styles.timelineCompany}>&mdash; {exp.company}</span>
                </h3>
                <p className={styles.timelineDesc}>{exp.description}</p>
                <div className={styles.techLine}>[ {exp.skills} ]</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
