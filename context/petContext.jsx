import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPets } from '../services/petService';

const PetContext = createContext(undefined);

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPets() {
    const data = await getPets();
    setPets(data);
  }

 async function fetchPets() {
  try {
    setLoading(true);
    const data = await getPets();
    console.log("LISTA ATUALIZADA - Qtd pets:", data.length); // Verifique isso no console!
    setPets([...data]);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  
  useEffect(() => {
  fetchPets();
}, []);

  return (
    <PetContext.Provider value={{ pets, loading, error, fetchPets, loadPets }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets deve estar dentro de PetProvider');
  return context;
}

