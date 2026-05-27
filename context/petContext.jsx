import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPets as getPets } from '../services/petService';

const PetContext = createContext(undefined);

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPets();
      setPets(data.pets || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <PetContext.Provider value={{ pets, loading, error, fetchPets }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets deve estar dentro de PetProvider');
  return context;
}