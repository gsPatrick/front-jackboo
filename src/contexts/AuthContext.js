// src/contexts/AuthContext.js
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setOnUnauthorizedCallback } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função para sair (logout), agora sem o alert
  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Redireciona para a página de login após o logout
    router.push('/login');
    // REMOVIDO: O alert foi removido para evitar pop-ups indesejados.
    // A notificação de sessão expirada deve ser mais sutil, se necessária.
  };

  useEffect(() => {
    // Registra a função de logout para ser chamada pelo api.js APENAS em caso de erro 401
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
        // CORREÇÃO: O else que chamava logout() foi removido.
        // Se não houver token/usuário, o estado simplesmente permanece nulo,
        // o que é o comportamento esperado para um usuário deslogado.
        // Chamar logout() aqui causava o redirecionamento e a mensagem de erro.
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação, limpando estado:", error);
        // Em caso de erro (ex: JSON malformado), aí sim forçamos o logout.
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();

    // Limpeza (boa prática)
    return () => {
      setOnUnauthorizedCallback(() => {});
    };
  }, []); // O array vazio garante que isso rode apenas na montagem do componente

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
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