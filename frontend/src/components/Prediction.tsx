import styles from './Prediction.module.css';

const Prediction = () => {
  return (
    <section className={styles.predictionSection}>
      <h1 className={styles.title}>Predict Drug-Target Interactions with Precision</h1>
      <p className={styles.subtitle}>
        Our advanced bioinformatics platform leverages machine learning to
        accurately predict how drugs interact with biological targets at the molecular level.
      </p>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Enter drug name or identifier (e.g., Aspirin, Ibuprofen)" 
          className={styles.searchInput}
        />
        <div className={styles.buttons}>
          <button className={styles.computeButton}>Compute Interaction</button>
        </div>
      </div>
    </section>
  );
};

export default Prediction; 