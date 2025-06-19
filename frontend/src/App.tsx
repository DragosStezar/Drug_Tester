import { useState } from 'react';
import Header from './components/Header';
import Prediction from './components/Prediction';
import Interactions from './components/Interactions';
import Features from './components/Features';
import Footer from './components/Footer';
import apiClient from './api';

export interface InteractionResult {
  receptor: string;
  receptorInfo: string;
  match: number;
  bindingAffinity: number;
  description: string;
}

function App() {
  const [interactions, setInteractions] = useState<InteractionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComputeInteraction = async (drugId: string) => {
    setIsLoading(true);
    setError(null);
    setInteractions([]);

    try {
      const response = await apiClient.post('/check_drugs/', { drug_ids: [drugId] });
      const results = response.data.results[0];
      if (results && results.top_targets) {
        const formattedResults: InteractionResult[] = results.top_targets.map((target: any) => ({
          receptor: target.target_name,
          receptorInfo: `Target ID: ${target.target_id}`,
          match: Math.round(target.probability * 100),
          bindingAffinity: target.probability.toFixed(4),
          description: `Confidence score: ${target.probability.toFixed(4)}`
        }));
        setInteractions(formattedResults);
      } else {
        setError('No interactions found for the selected drug.');
      }
    } catch (err) {
      setError('An error occurred while fetching interaction data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Prediction onCompute={handleComputeInteraction} />
        <Interactions results={interactions} isLoading={isLoading} error={error} />
        <Features />
      </main>
      <Footer />
    </>
  )
}

export default App
