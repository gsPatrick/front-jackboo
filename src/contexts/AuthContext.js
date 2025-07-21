// src/contexts/AuthContext.js
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar o router
// NOVO: Importa a função que definimos no api.js
import { setOnUnauthorizedCallback } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Inicializa o router

  // Função para sair (logout)
  const logout = () => {
    console.log("Executando logout do contexto...");
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Redireciona para a página de login após o logout
    router.push('/login');
    alert("Sua sessão expirou. Por favor, faça login novamente.");
  };

  // Efeito para carregar o estado e configurar o callback de logout
  useEffect(() => {
    // Registra a função de logout para ser chamada pelo apiRequest em caso de 401
    setOnUnauthorizedCallback(() => logout());

    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação:", error);
        // Se houver erro, desloga para garantir um estado limpo
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();

    // Limpeza: desregistra o callback ao desmontar (boa prática)
    return () => {
      setOnUnauthorizedCallback(() => {});
    };
  }, []); // O array vazio garante que isso rode apenas uma vez

  // Função para atualizar o estado após login/cadastro
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Função para atualizar o perfil
  const updateUserProfile = (newUserData) => {
      setUser(prevUser => {
          const updatedUser = { ...prevUser, ...newUserData };
          if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return updatedUser;
      });
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUserProfile,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;