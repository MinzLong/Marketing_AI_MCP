import axios from 'axios';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
            console.log('API Request:', config);
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
request.interceptors.response.use(
    (response) => {
        if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
            console.log('API Response:', response);
        }
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data || error.message);

        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default request;