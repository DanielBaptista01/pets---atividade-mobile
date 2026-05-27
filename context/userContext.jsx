import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/petService';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@PetAdopt:user');
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem('@PetAdopt:user', JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem('@PetAdopt:user');
      setUserState(null);
    }
  };

  const login = async (email, password) => {
    // Aplica o .trim() para evitar que espaços no email ou senha quebrem o login
    return await apiLogin(email.trim(), password.trim());
  };

  // 🔒 CORREÇÃO AQUI: Remove espaços invisíveis antes de enviar para a API
  const fetchuserRegister = async (name, email, password, phone, confirmpassword) => {
    return await apiRegister(
      name, 
      email.trim(), 
      phone.trim(), 
      password.trim(), // <- .trim() garante que espaços extras sumam
      confirmpassword.trim() // <- .trim() garante que espaços extras sumam
    );
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, fetchuserRegister }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserRegister() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserRegister deve estar dentro de UserProvider');
  return context;
}