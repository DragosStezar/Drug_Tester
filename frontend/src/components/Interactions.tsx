import InteractionCard from './InteractionCard';
import styles from './Interactions.module.css';

const interactionsData = [
  {
    receptor: 'EGFR Receptor',
    receptorInfo: 'Epidermal Growth Factor Receptor',
    match: 92,
    bindingAffinity: -9.2,
    description: 'Strong inhibitory effect on the EGFR signaling pathway, potentially useful for treating certain types of cancer.'
  },
  {
    receptor: 'ACE2 Protein',
    receptorInfo: 'Angiotensin-Converting Enzyme 2',
    match: 87,
    bindingAffinity: -8.7,
    description: 'Moderate binding to ACE2 receptors with potential applications in cardiovascular and pulmonary conditions.'
  },
  {
    receptor: 'Dopamine Receptor D2',
    receptorInfo: 'DRD2',
    match: 78,
    bindingAffinity: -8.1,
    description: 'Partial agonist activity at dopamine D2 receptors, suggesting potential applications in neuropsychiatric disorders.'
  },
    {
    receptor: 'COX-2 Enzyme',
    receptorInfo: 'Cyclooxygenase-2',
    match: 75,
    bindingAffinity: -7.9,
    description: 'Selective inhibition of COX-2, suggesting anti-inflammatory properties with reduced gastrointestinal side effects.'
  },
  {
    receptor: '5-HT2A Receptor',
    receptorInfo: 'Serotonin Receptor',
    match: 68,
    bindingAffinity: -7.3,
    description: 'Moderate antagonist activity at 5-HT2A receptors, with potential applications in psychiatric and neurological disorders.'
  }
];


const Interactions = () => {
  return (
    <section className={styles.interactionsSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Predicted Interactions</h2>
      </div>
      <div className={styles.cardsContainer}>
        {interactionsData.map((item, index) => (
          <InteractionCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default Interactions; 