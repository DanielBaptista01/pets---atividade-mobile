import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPets } from '../services/petService';

const PetContext = createContext(undefined);

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  async function fetchPets() {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  }

  
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

