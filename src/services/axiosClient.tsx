import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);