import axios from 'axios';

const api = axios.create({
    // Utilise la variable d'environnement VITE_API_BASE_URL fournie par Netlify,
    // avec fallback sur localhost pour le développement local.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;