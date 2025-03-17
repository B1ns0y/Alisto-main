import axios from 'axios';

// Update this to match your API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface UserData {
  username: string;
  profile_picture?: string;
  // Add other user fields as needed
}

export const fetchUserData = async (): Promise<UserData> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    // Updated to match your actual API endpoint
    const response = await axios.get(`${API_BASE_URL}/users/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      username: response.data.username,
      profile_picture: response.data.profile_picture || ''
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<UserData>): Promise<UserData> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    // Updated to match your settings endpoint
    const response = await axios.patch(`${API_BASE_URL}/settings/`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }
  
  try {
    // You may need to update this endpoint to match your refresh token endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
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

// Setup axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const newToken = await refreshToken();
        
        // Update the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        
        // Dispatch an event that can be caught by your app to redirect to login
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);