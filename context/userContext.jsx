// context/userContext.js
import React, { createContext, useContext, useState } from 'react'; // Removido 'use' e 'useEffect' desnecessários
import { registerUser } from '../services/petService'; // ADICIONE ESTA LINHA

const userContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchuserRegister(name, email, password, phone, confirmpassword) {
    try {
      setLoading(true);
      setError(null);
      // Agora o JavaScript saberá o que é registerUser
      const response = await registerUser(name, email, password, phone, confirmpassword);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserLogin(email, password) {
   try {
    setLoading(true);
    const response = await login(email, password); // Chama o serviço de login
    setUser(response); // SALVA O TOKEN E DADOS AQUI
    return response;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
  }

  // Removido o useEffect que chamava o registro vazio ao abrir o app

  return (
    <userContext.Provider value={{ user,setUser ,loading, error, fetchuserRegister, fetchUserLogin }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserRegister() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUserRegister deve estar dentro de UserProvider');
  return context;
}

export function useUserLogin() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUserLogin deve estar dentro de UserProvider');
  return context;
}