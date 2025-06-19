import InteractionCard from './InteractionCard';
import styles from './Interactions.module.css';
import type { InteractionResult } from '../App';

interface InteractionsProps {
  results: InteractionResult[];
  isLoading: boolean;
  error: string | null;
}

const Interactions = ({ results, isLoading, error }: InteractionsProps) => {
  if (isLoading) {
    return <div className={styles.message}>Loading...</div>;
  }

  if (error) {
    return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
  }

  if (results.length === 0) {
    return null; // Don't show the component if there are no results
  }
  
  return (
    <section className={styles.interactionsSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Predicted Interactions</h2>
      </div>
      <div className={styles.cardsContainer}>
        {results.map((item, index) => (
          <InteractionCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default Interactions; 