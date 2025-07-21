// src/services/api.js

const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host/api';

// --- Callback global para deslogar em caso de erro 401 ---
let onUnauthorizedCallback = () => {};
export const setOnUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};
// -----------------------------------------------------------

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Função genérica para todas as chamadas de API
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  let requestBody = options.body;

  if (requestBody instanceof FormData) {
    // Para FormData, o navegador define o Content-Type automaticamente com o boundary
  } else if (requestBody && typeof requestBody === 'object') {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(requestBody);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.log("API retornou 401 Unauthorized. Chamando callback de logout.");
      onUnauthorizedCallback();
    }
    
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText || 'Erro desconhecido na API' };
    }
    console.error(`Erro na API ${endpoint} [${response.status}]:`, errorData);
    throw new Error(errorData.message || `Erro ${response.status} ao chamar ${endpoint}`);
  }

  return response.status === 204 ? null : await response.json();
};


// --- SERVIÇO DE AUTENTICAÇÃO ---
export const authService = {
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  getUserProfile: () => apiRequest('/auth/profile', { method: 'GET' }),
  getSettings: () => apiRequest('/auth/settings', { method: 'GET' }),
  updateSetting: (key, value) => apiRequest(`/auth/settings/${key}`, { method: 'PUT', body: { value } }),
};

// --- SERVIÇO DE CONTEÚDO (Personagens/Livros do Usuário) ---
export const contentService = {
  createCharacter: (formData) => apiRequest('/content/characters', { method: 'POST', body: formData }),
  getMyCharacters: () => apiRequest('/content/characters', { method: 'GET' }),
  deleteCharacter: (id) => apiRequest(`/content/characters/${id}`, { method: 'DELETE' }),
  createColoringBook: (bookData) => apiRequest('/content/books/create-coloring', { method: 'POST', body: bookData }),
  createStoryBook: (bookData) => apiRequest('/content/books/create-story', { method: 'POST', body: bookData }),
  getMyBooks: () => apiRequest('/content/books', { method: 'GET' }),
};

// --- SERVIÇOS DE ADMIN ---

export const adminCharactersService = {
    listOfficialCharacters: () => apiRequest('/admin/characters', { method: 'GET' }),
    createOfficialCharacter: (formData) => apiRequest('/admin/characters', { method: 'POST', body: formData }),
    updateOfficialCharacter: (id, formData) => apiRequest(`/admin/characters/${id}`, { method: 'PUT', body: formData }),
    deleteOfficialCharacter: (id) => apiRequest(`/admin/characters/${id}`, { method: 'DELETE' }),
};

export const adminTaxonomiesService = {
  // Funções de listagem para formulários
  listAllAiSettings: () => apiRequest('/admin/taxonomies/ai-settings', { method: 'GET' }),
  listCategories: () => apiRequest('/admin/taxonomies/categories', { method: 'GET' }),
  listAgeRatings: () => apiRequest('/admin/taxonomies/age-ratings', { method: 'GET' }),

  // CRUD completo para Print Formats
  listPrintFormats: () => apiRequest('/admin/taxonomies/print-formats', { method: 'GET' }),
  createPrintFormat: (formatData) => apiRequest('/admin/taxonomies/print-formats', { method: 'POST', body: formatData }),
  updatePrintFormat: (id, formatData) => apiRequest(`/admin/taxonomies/print-formats/${id}`, { method: 'PUT', body: formatData }),
  deletePrintFormat: (id) => apiRequest(`/admin/taxonomies/print-formats/${id}`, { method: 'DELETE' }),
};

export const adminBookGeneratorService = {
  generateBookPreview: (bookType, generationData) => apiRequest('/admin/generator/preview', { method: 'POST', body: { bookType, ...generationData } }),
  regeneratePage: (pageId) => apiRequest(`/admin/generator/pages/${pageId}/regenerate`, { method: 'POST' }),
  finalizeBook: (bookId) => apiRequest(`/admin/generator/books/${bookId}/finalize`, { method: 'POST' }),
};

// NOVO SERVIÇO PARA GERENCIAR LIVROS OFICIAIS (CRUD)
export const adminBooksService = {
    listOfficialBooks: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/admin/books${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    getOfficialBookById: (id) => apiRequest(`/admin/books/${id}`, { method: 'GET' }), // <<-- CORRIGIDO: Agora está no serviço correto
    deleteOfficialBook: (id) => apiRequest(`/admin/books/${id}`, { method: 'DELETE' }),
};