// Footer.tsx
import React from 'react';
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://github.com/angenue/MoodJournal" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github" style={{ fontSize: '30px' }}></i>
      </a>
    </footer>
  );
};

export default Footer;
