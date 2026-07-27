import axios from 'axios';
import { authService } from '../services/AuthService';
import { useAuthStore } from '../lib/store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: `${API_URL}`,
    timeout: 300000,
});

axiosClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const { refreshToken, setAuth, logout, setUser } = useAuthStore.getState();

        if (status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;

            try {
                const data = await authService.refreshAccessToken(refreshToken);
                
                setAuth(
                    data.token.accessToken,
                    data.token.refreshToken,
                );

                setUser(data.user)
                    
                originalRequest.headers.Authorization = `Bearer ${data.token.accessToken}`;

                return axiosClient(originalRequest);
            } catch (err) {
                logout();
                return Promise.reject(err);
            }
        }
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;