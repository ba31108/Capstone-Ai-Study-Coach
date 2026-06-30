import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`API Error [${error.response.status}]:`, error.response.data);
      }
    } else if (error.request) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('No response from server:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
