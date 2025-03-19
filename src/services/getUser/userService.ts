import axios from 'axios';
import { axiosClient } from '../axiosClient';

// Update this to match your API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserData {
  username: string;
  profile_picture?: string;
}

export const fetchUserData = () => {
  try {
    const res = axiosClient.get("/users/user/")
    return res
  } catch (error) {
    throw error
  }
}

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }
  
  try {
    interface RefreshTokenResponse {
      access_token: string;
    }

    const response = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh/`, {
      refresh_token: refreshToken
    });
    
    const newAccessToken = response.data.access_token;
    localStorage.setItem('access_token', newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);