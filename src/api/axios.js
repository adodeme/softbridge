import axios from 'axios';

const api = axios.create({
    baseURL: 'https://romas-backend.onrender.com',
    // Retrait du Content-Type global pour permettre le multipart/form-data
    headers: {
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
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