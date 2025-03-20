import axiosClient from "@/services/axiosClient";

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
