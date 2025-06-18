import { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/Logo.svg" alt="BioInteractPro Logo" className={styles.logoIcon} />
        <span style={{color: '#34495e'}}>BioInteract</span><span>Pro</span>
      </div>
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        &#9776; {/* Hamburger Icon */}
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <a href="#">Home</a>
        <a href="#">Database</a>
        <a href="#">Algorithms</a>
        <a href="#">Documentation</a>
        <a href="#">About</a>
      </nav>
    </header>
  );
};

export default Header; 