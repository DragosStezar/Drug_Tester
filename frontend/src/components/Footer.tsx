import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>BioInteractPro</h3>
          <p>Advanced bioinformatics platform for drug-target interaction prediction and analysis.</p>
          {/* Social icons would go here */}
        </div>
        <div className={styles.links}>
          <div>
            <h4>Platform</h4>
            <a href="#">Features</a>
            <a href="#">Algorithms</a>
            <a href="#">API</a>
            <a href="#">Integrations</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Research Papers</a>
            <a href="#">Blog</a>
            <a href="#">Community</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className={styles.legal}>
        <p>&copy; {new Date().getFullYear()} BioInteractPro. All rights reserved.</p>
        <div>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 