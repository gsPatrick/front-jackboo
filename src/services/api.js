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
  // Atualizado: buscar perfil do usuário logado
  getUserProfile: () => apiRequest('/auth/profile', { method: 'GET' }),
  // NOVO: Atualizar perfil do usuário logado
  updateUserProfile: (profileData) => apiRequest('/auth/profile', { method: 'PUT', body: profileData }),
  getSettings: () => apiRequest('/auth/settings', { method: 'GET' }),
  updateSetting: (key, value) => apiRequest(`/auth/settings/${key}`, { method: 'PUT', body: { value } }),
};

// --- SERVIÇO DE CONTEÚDO (Personagens/Livros do Usuário) ---
export const contentService = {
  createCharacter: (formData) => apiRequest('/content/characters', { method: 'POST', body: formData }),
  getMyCharacters: () => apiRequest('/content/characters', { method: 'GET' }),
  deleteCharacter: (id) => apiRequest(`/content/characters/${id}`, { method: 'DELETE' }),
  updateCharacterName: (id, name) => apiRequest(`/content/characters/${id}/name`, { method: 'PUT', body: { name } }),
  createColoringBook: ({ characterIds, theme }) => apiRequest('/content/books/create-coloring', { method: 'POST', body: { characterIds, theme } }),
  createStoryBook: (bookData) => apiRequest('/content/books/create-story', { method: 'POST', body: bookData }),
  getMyBooks: () => apiRequest('/content/books', { method: 'GET' }),
  getBookStatus: (bookId) => apiRequest(`/content/books/${bookId}/status`, { method: 'GET' }),
};

// --- SERVIÇO DE LOJA (Shop) ---
export const shopService = {
    getJackbooShelf: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/shop/jackboo?${query}`, { method: 'GET' });
    },
    getFriendsShelf: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/shop/friends?${query}`, { method: 'GET' });
    },
    getBookDetails: (bookId) => apiRequest(`/shop/books/${bookId}`, { method: 'GET' }),
    getRelatedBooks: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/shop/related?${query}`, { method: 'GET' });
    },
};

// --- NOVO: SERVIÇO DE POPULARIDADE (Likes) ---
export const popularityService = {
  toggleLike: (likableType, likableId) => apiRequest(`/popularity/${likableType}/${likableId}/toggle-like`, { method: 'POST' }),
  getLikesCount: (likableType, likableId) => apiRequest(`/popularity/${likableType}/${likableId}/count`, { method: 'GET' }),
};
// --- FIM: SERVIÇO DE POPULARIDADE ---


// --- SERVIÇOS DE ADMIN ---
export const adminLeonardoService = {
  listDatasets: () => apiRequest('/admin/leonardo/datasets', { method: 'GET' }),
  createDataset: (name, description) => apiRequest('/admin/leonardo/datasets', { method: 'POST', body: { name, description } }),
  getDatasetDetails: (localDatasetId) => apiRequest(`/admin/leonardo/datasets/${localDatasetId}`, { method: 'GET' }),
  uploadImageToDataset: (localDatasetId, formData) => apiRequest(`/admin/leonardo/datasets/${localDatasetId}/upload`, { method: 'POST', body: formData }),
  deleteDataset: (localDatasetId) => apiRequest(`/admin/leonardo/datasets/${localDatasetId}`, { method: 'DELETE' }),
  listElements: () => apiRequest('/admin/leonardo/elements', { method: 'GET' }),
  trainElement: (trainingData) => apiRequest('/admin/leonardo/elements/train', { method: 'POST', body: trainingData }),
  getElementDetails: (localElementId) => apiRequest(`/admin/leonardo/elements/${localElementId}`, { method: 'GET' }),
  updateElement: (localElementId, updateData) => apiRequest(`/admin/leonardo/elements/${localElementId}`, { method: 'PUT', body: updateData }),
  deleteElement: (localElementId) => apiRequest(`/admin/leonardo/elements/${localElementId}`, { method: 'DELETE' }),
};

export const adminAISettingsService = {
  listSettings: () => apiRequest('/admin/openai-settings', { method: 'GET' }),
  createOrUpdateSetting: (type, settingData) => apiRequest(`/admin/openai-settings/${type}`, { method: 'PUT', body: settingData }),
  deleteSetting: (type) => apiRequest(`/admin/openai-settings/${type}`, { method: 'DELETE' }),
};

export const adminAssetsService = {
  listAssets: () => apiRequest('/admin/assets', { method: 'GET' }),
  createAsset: (formData) => apiRequest('/admin/assets', { method: 'POST', body: formData }),
  deleteAsset: (id) => apiRequest(`/admin/assets/${id}`, { method: 'DELETE' }),
};

export const adminCharactersService = {
    listCharacters: () => apiRequest('/admin/characters', { method: 'GET' }),
    createOfficialCharacter: (formData) => apiRequest('/admin/characters/generate', { method: 'POST', body: formData }),
    createOfficialCharacterByUpload: (formData) => apiRequest('/admin/characters/upload', { method: 'POST', body: formData }),
    deleteOfficialCharacter: (id) => apiRequest(`/admin/characters/${id}`, { method: 'DELETE' }),
};
export const adminTaxonomiesService = {
  listAiTemplates: () => apiRequest('/admin/taxonomies/ai-settings', { method: 'GET' }),
  listCategories: () => apiRequest('/admin/taxonomies/categories', { method: 'GET' }),
  listAgeRatings: () => apiRequest('/admin/taxonomies/age-ratings', { method: 'GET' }),
  listPrintFormats: () => apiRequest('/admin/taxonomies/print-formats', { method: 'GET' }),
  createPrintFormat: (formatData) => apiRequest('/admin/taxonomies/print-formats', { method: 'POST', body: formatData }),
  updatePrintFormat: (id, formatData) => apiRequest(`/admin/taxonomies/print-formats/${id}`, { method: 'PUT', body: formatData }),
  deletePrintFormat: (id) => apiRequest(`/admin/taxonomies/print-formats/${id}`, { method: 'DELETE' }),
};

export const adminBookGeneratorService = {
  generateBookPreview: (bookType, generationData) => apiRequest('/admin/generator/preview', { method: 'POST', body: { bookType, ...generationData } }),
  getBookById: (bookId) => apiRequest(`/admin/generator/books/${bookId}`, { method: 'GET' }),
  regeneratePage: (pageId) => apiRequest(`/admin/generator/pages/${pageId}/regenerate`, { method: 'POST' }),
  finalizeBook: (bookId) => apiRequest(`/admin/generator/books/${bookId}/finalize`, { method: 'POST' }),
};

export const adminUsersService = {
  listUsers: () => apiRequest('/admin/users', { method: 'GET' }),
};

export const adminBooksService = {
    listAllBooks: () => apiRequest('/admin/books', { method: 'GET' }),
    getOfficialBookById: (id) => apiRequest(`/admin/books/${id}`, { method: 'GET' }),
    deleteOfficialBook: (id) => apiRequest(`/admin/books/${id}`, { method: 'DELETE' }),
        updateOfficialBookStatus: (id, status) => apiRequest(`/admin/books/${id}/status`, { method: 'PUT', body: { status } }),

};
export const adminAIHelperService = {
  generateText: (prompt) => apiRequest('/admin/ai-helper/generate-text', { method: 'POST', body: { prompt } }),
};