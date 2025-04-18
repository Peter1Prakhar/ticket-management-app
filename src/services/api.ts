import axios from 'axios';

const baseURL = 
  process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Add request interceptor to set auth header from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;