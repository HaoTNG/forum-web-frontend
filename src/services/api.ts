// src/services/api.ts
import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokenMangaer.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Request interceptor → Gắn access token vào header
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor → Refresh token nếu access token hết hạn
api.interceptors.response.use(
    (response) => response, // Pass qua nếu không lỗi
    async (error) => {
        const originalRequest = error.config;

        // Nếu token hết hạn & chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    clearTokens();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Gọi API refresh token
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;

                setTokens(newAccessToken, newRefreshToken);

                // Gắn token mới vào header và retry request cũ
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
