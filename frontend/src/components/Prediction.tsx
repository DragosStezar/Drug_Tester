import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Prediction.module.css';
import apiClient from '../api';

interface Drug {
  drug_id: string;
  drug_name: string;
}

interface PredictionProps {
  onCompute: (drugId: string) => void;
}

const Prediction = ({ onCompute }: PredictionProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await apiClient.get(`/drugs/?q=${searchQuery}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Failed to fetch drug suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (query) {
      const handler = setTimeout(() => {
        fetchSuggestions(query);
      }, 300); // Debounce time

      return () => {
        clearTimeout(handler);
      };
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setQuery(drug.drug_name);
    setSuggestions([]);
    setIsDropdownVisible(false);
  };

  const handleSubmit = () => {
    if (selectedDrug) {
      onCompute(selectedDrug.drug_id);
    }
  };

  return (
    <section className={styles.predictionSection}>
      <h1 className={styles.title}>Predict Drug-Target Interactions with Precision</h1>
      <p className={styles.subtitle}>
        Our advanced bioinformatics platform leverages machine learning to
        accurately predict how drugs interact with biological targets at the molecular level.
      </p>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper} ref={searchWrapperRef}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedDrug(null);
              setIsDropdownVisible(true);
            }}
            onFocus={() => setIsDropdownVisible(true)}
            placeholder="Enter drug name or identifier (e.g., Aspirin, Ibuprofen)" 
            className={styles.searchInput}
            autoComplete="off"
          />
          {isDropdownVisible && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((drug) => (
                <li key={drug.drug_id} onClick={() => handleSelectDrug(drug)}>
                  {drug.drug_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.buttons}>
          <button 
            className={styles.computeButton} 
            onClick={handleSubmit}
            disabled={!selectedDrug}
          >
            Compute Interaction
          </button>
        </div>
      </div>
    </section>
  );
};

export default Prediction;