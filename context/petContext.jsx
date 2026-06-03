import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPets as getPetsAPI } from '../services/petService';

const PetContext = createContext(undefined);

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega a vitrine inicial de uma vez só
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPetsAPI();
      const lista = data.pets || data;
      if (Array.isArray(lista)) {
        setPets(lista);
      }
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
    <PetContext.Provider value={{ pets, setPets, loading, setLoading, error, setError, fetchPets }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets deve estar dentro de PetProvider');
  return context;
}