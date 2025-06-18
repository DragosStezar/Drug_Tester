import styles from './InteractionCard.module.css';

interface InteractionCardProps {
  receptor: string;
  receptorInfo: string;
  match: number;
  bindingAffinity: number;
  description: string;
}

const InteractionCard = ({ receptor, receptorInfo, match, bindingAffinity, description }: InteractionCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.receptor}>{receptor}</h3>
        <span className={styles.match}>{match}% Match</span>
      </div>
      <p className={styles.receptorInfo}>{receptorInfo}</p>
      <div className={styles.bindingInfo}>
        <span>Binding Affinity</span>
        <span className={styles.bindingValue}>{bindingAffinity} kcal/mol</span>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.active}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <a href="#" className={styles.detailsLink}>View Details</a>
      </div>
    </div>
  );
};

export default InteractionCard; 