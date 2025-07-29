// src/contexts/AuthContext.js
'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useRouter } from 'next/navigation';
import { setOnUnauthorizedCallback, authService } from '@/services/api'; // Importar authService

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => { // Usar useCallback para memoizar
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  }, [router]); // router como dependência

  // NOVO: Função para atualizar apenas partes do perfil do usuário no contexto
  const updateUserProfile = useCallback((updates) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    });
  }, []);

  useEffect(() => {
    setOnUnauthorizedCallback(() => logout());

    const loadAuthState = async () => { // Usar async para buscar perfil
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) { // Se tiver token, tenta buscar o perfil atualizado
          setToken(storedToken);
          try {
            // Buscando o perfil atualizado da API
            const profile = await authService.getUserProfile();
            // A API de perfil deve retornar o slug também
            // Supondo que `profile` tenha { id, nickname, email, avatarUrl, role, slug, etc. }
            setUser(profile); 
            localStorage.setItem('user', JSON.stringify(profile)); // Atualiza localStorage com dados frescos
          } catch (profileError) {
            console.error("Erro ao carregar perfil do usuário pela API:", profileError);
            // Se falhar a busca do perfil, tenta usar o que está no localStorage
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } else {
              logout(); // Se não tiver nem no localStorage, desloga
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação, limpando estado:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();

    return () => {
      setOnUnauthorizedCallback(() => {});
    };
  }, [logout]); // logout como dependência

  const login = useCallback((userData, authToken) => { // Usar useCallback para memoizar
    // Assumimos que userData aqui já vem com 'slug' e todos os campos relevantes
    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    updateUserProfile, // NOVO: Disponibiliza a função de atualização
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;