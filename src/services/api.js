// src/services/api.js

// Importa funções de navegação ou manipulação de estado global se necessário
// Ex: import { useRouter } from 'next/navigation';
// Ex: import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host/api';

// Função para obter o token de autenticação (deve vir do seu estado global/local storage)
const getToken = () => {
  // Lógica para buscar o token. Ex:
  // return localStorage.getItem('token');
  // Ou de um store global:
  // const token = useAuthStore.getState().token; return token;
  // Por enquanto, vamos retornar um placeholder
  console.warn("getToken() precisa ser implementado para buscar o token de autenticação.");
  return null; // Retorna null se não houver token
};

// Função genérica para lidar com chamadas de API
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Adiciona o header de autorização se o token existir
    ...options.headers, // Permite adicionar outros headers customizados
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Trata erros HTTP e respostas não-JSON
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Se a resposta não for JSON (ex: 204 No Content, ou erro de servidor sem corpo JSON)
      errorData = { message: response.statusText || 'Erro desconhecido' };
    }
    console.error(`Erro na API ${endpoint}:`, errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // Retorna os dados JSON, ou null se for uma resposta sem conteúdo (ex: 204)
  return response.status === 204 ? null : await response.json();
};

// --- ENDPOINTS ESPECÍFICOS ---

// Autenticação e Usuário
export const authService = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  // Adicionar aqui outras funções de auth conforme a documentação (registerAdmin, getUsers, getUserById, etc.)
  // Exemplo:
  // getAllUsers: async () => {
  //   return apiRequest('/auth/users', { method: 'GET' });
  // },
  // getUserById: async (id) => {
  //   return apiRequest(`/auth/users/${id}`, { method: 'GET' });
  // },
  // updateUser: async (id, userData) => {
  //    return apiRequest(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
  // },
  // deleteUser: async (id) => {
  //      return apiRequest(`/auth/users/${id}`, { method: 'DELETE' });
  // },
};

// Outros serviços podem ser adicionados aqui conforme a necessidade:
// export const addressService = { ... };
// export const shopService = { ... };
// export const contentService = { ... };
// ... etc.

// --- Dicas para Implementação ---
// 1. Gerenciamento de Token: A função `getToken` é crucial. Certifique-se de que ela
//    recupere o token armazenado corretamente (localStorage, Context API, Zustand, etc.)
//    e que seja chamada sempre que `apiRequest` for usar autenticação.
// 2. Tratamento de Erros: A função `apiRequest` lança um erro em caso de resposta
//    não-OK. Os componentes que chamam esses serviços devem usar `try...catch`
//    para lidar com esses erros (ex: mostrar mensagem para o usuário).
// 3. Configuração de Cabeçalhos: O `Content-Type` é definido como `application/json`
//    por padrão. Para rotas que usam `multipart/form-data` (como criação de personagens
//    ou submissão de desenhos), você precisará configurar o `Content-Type`
//    especificamente na chamada da função (ex: `headers: { 'Content-Type': 'multipart/form-data' }`)
//    e usar `JSON.stringify` apenas para corpos JSON. O `fetch` cuida disso para `multipart`.
// 4. Mocking: Durante o desenvolvimento, você pode usar bibliotecas como `msw` (Mock Service Worker)
//    para simular as respostas da API antes de ter os endpoints funcionando.