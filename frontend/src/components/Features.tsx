import FeatureCard from './FeatureCard';
import styles from './Features.module.css';

const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
  </svg>
);

const AIPredictionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3.75m14.25 9.75l-3-3m0 0l-3 3m3-3v6m-9-3.75h.008v.008H7.5v-.008zm3 0h.008v.008H10.5v-.008zm3 0h.008v.008H13.5v-.008z" />
  </svg>
);


const featuresData = [
  {
    icon: <DatabaseIcon />,
    title: 'Comprehensive Database',
    description: 'Access our extensive library of drugs, compounds, and biological targets with detailed molecular properties.'
  },
  {
    icon: <AIPredictionsIcon />,
    title: 'AI-Powered Predictions',
    description: 'Leverage advanced machine learning algorithms to predict drug-target interactions with high accuracy.'
  },
  {
    icon: <AnalyticsIcon />,
    title: 'Detailed Analytics',
    description: 'Explore comprehensive data visualizations and statistical analyses of predicted interactions.'
  }
];

const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.title}>Platform Features</h2>
      <div className={styles.cardsContainer}>
        {featuresData.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features; 