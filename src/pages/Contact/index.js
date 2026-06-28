import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faArrowRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import styles from "./style.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setIsSuccess(false);
    try {
      await axios.post("https://node-mailer-ten.vercel.app/sendEmail", {
        username: formData.name,
        usermail: formData.email,
        subject: `Portfolio Contact from ${formData.name}`,
        text: formData.message,
      });
      // Clear inputs
      setFormData({ name: "", email: "", message: "" });
      // Set success state
      setIsSuccess(true);
      // Revert button text after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending email:", err);
      setToastMsg("Failed to send message. Please try again.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setToastMsg(`${label} copied to clipboard!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="about-slide-wrapper">
      {/* Clipboard copy toast notification */}
      <div className={`${styles.toast} ${showToast ? styles.toastShow : ""}`}>
        {toastMsg}
      </div>

      {/* Left side: details */}
      <div className="contact-info">
        <div>
          <span className="about-subtitle">Get In Touch</span>
          <h2 className="about-title">Let&apos;s build something great together</h2>
        </div>
        <p className="about-description">
          I am currently open to new roles, projects, or collaborations. Send a message or connect via my socials!
        </p>
        
        {/* Core details (Vertical) */}
        <div className={styles.contactDetailsList}>
          {/* Email Item - Click to Copy */}
          <div 
            className={styles.contactDetailItem}
            onClick={() => copyToClipboard("nikhilkohli2407@gmail.com", "Email Address")}
            title="Click to copy email address"
          >
            <div className={styles.contactDetailIcon}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className={styles.contactDetailText}>
              <h4>Email</h4>
              <p>nikhilkohli2407@gmail.com</p>
            </div>
          </div>

          {/* Location Item - Click to Copy */}
          <div 
            className={styles.contactDetailItem}
            onClick={() => copyToClipboard("India", "Location")}
            title="Click to copy location"
          >
            <div className={styles.contactDetailIcon}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className={styles.contactDetailText}>
              <h4>Location</h4>
              <p>India</p>
            </div>
          </div>
        </div>

        {/* Brand Link Buttons (Horizontal Row) */}
        <div className={styles.socialsRow}>
          <a 
            href="https://github.com/nikhilko-07"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialIconButton}
            title="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a 
            href="https://x.com/NikhilKo_07"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialIconButton}
            title="Twitter"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a 
            href="https://instagram.com/nikhilko_07"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialIconButton}
            title="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a 
            href="https://www.linkedin.com/in/nikhil-kohli-443a06325"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialIconButton}
            title="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a 
            href="https://leetcode.com/u/jhy9ZoHyV9"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialIconButton}
            title="LeetCode"
          >
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" style={{ display: "block" }}>
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.8 9.8a1.375 1.375 0 0 0 0 1.956l.08.08a1.368 1.368 0 0 0 1.96 0L14.5 2.5l7.007 7.007c-.453.513-1.077.85-1.782.906l-.08.007h-8.084a1.374 1.374 0 0 0-1.374 1.373v.077a1.37 1.37 0 0 0 1.374 1.374h8.084c.73 0 1.385-.4 1.79-.988l.08-.08 1.326-1.327a1.376 1.376 0 0 0 0-1.956L14.453.414a1.368 1.368 0 0 0-.97-.414zM8.513 14.5a1.374 1.374 0 0 0-1.374 1.373v.077a1.37 1.37 0 0 0 1.374 1.374H16.6a1.374 1.374 0 0 0 1.374-1.373v-.077a1.37 1.37 0 0 0-1.374-1.374H8.513z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Right side: form card */}
      <div className={styles.contactFormCard}>
        {/* Contact Form Element */}
        <form className={styles.contactFormElement} onSubmit={handleSubmit}>
          <div className={styles.contactFormGroup}>
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              className={styles.inputField} 
              placeholder="John Doe" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          <div className={styles.contactFormGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className={styles.inputField} 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className={styles.contactFormGroup}>
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              className={styles.textareaField} 
              rows="3" 
              placeholder="Hi Nikhil, let's talk about..." 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button 
            type="submit" 
            className={`${styles.submitButton} ${isSuccess ? styles.successButton : ""}`} 
            disabled={isSending || isSuccess}
          >
            {isSending ? (
              "Sending..."
            ) : isSuccess ? (
              <>Sent Successfully <FontAwesomeIcon icon={faCheckCircle} /></>
            ) : (
              <>Send Message <FontAwesomeIcon icon={faArrowRight} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
