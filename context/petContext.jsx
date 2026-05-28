import React, { createContext, useContext, useState } from 'react';

const PetContext = createContext(undefined);

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // O contexto agora apenas guarda os estados compartilhados
  return (
    <PetContext.Provider value={{ pets, setPets, loading, setLoading, error, setError }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets deve estar dentro de PetProvider');
  return context;
}