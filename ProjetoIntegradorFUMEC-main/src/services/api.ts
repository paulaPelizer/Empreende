import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: !SKIP_AUTH,
});

// Injeta o token Bearer somente quando a autenticação estiver ativada
api.interceptors.request.use((config) => {
  if (!SKIP_AUTH) {
    const token = localStorage.getItem('empreende_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Trata erro 401 somente quando autenticação estiver ativada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!SKIP_AUTH && error.response?.status === 401) {
      localStorage.removeItem('empreende_token');
      localStorage.removeItem('empreende_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export default api;