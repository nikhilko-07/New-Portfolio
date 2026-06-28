import styles from "./style.module.css";
import {
  FaPython,
  FaReact,
  FaJava,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";

import { SiJavascript, SiExpress, SiTypescript, SiMongodb } from "react-icons/si";
import { TbBinaryTree2 } from "react-icons/tb";

const skills = [
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Java", icon: <FaJava /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "React", icon: <FaReact /> },
  { name: "Node.js", icon: <FaNodeJs /> },
  { name: "SQL", icon: <FaDatabase /> },
  { name: "Data Structures", icon: <TbBinaryTree2 /> },
  { name: "Git", icon: <FaGitAlt /> },
  { name: "Express", icon: <SiExpress /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "Docker", icon: <FaDocker /> },
  { name: "Python", icon: <FaPython /> },
];

export default function Skills() {
  return (
    <section className={styles["skills-section"]}>
      <div className={styles["skills-header"]}>
        <h2>TECHNICAL EXPERTISE</h2>
        <div className={styles["heading-line"]}></div>
        <p>Precision tools for complex problems</p>
      </div>

      <div className={styles["skills-grid"]}>
        {skills.map((skill, index) => (
          <div className={styles["skill-card"]} key={index}>
            <div className={styles["skill-icon"]}>
              {skill.icon}
            </div>
            <h4>{skill.name}</h4>
            <div className={styles["card-divider"]}></div>
          </div>
        ))}
      </div>
    </section>
  );
}