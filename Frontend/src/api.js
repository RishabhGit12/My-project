import axios from 'axios';

// Vite requires environment variables to start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;