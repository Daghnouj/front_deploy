import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://deploy-back-3.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour l'authentification
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion des erreurs globales
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Gérer les erreurs spécifiques
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;