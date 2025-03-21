import api from "@/middleware/api";
import { IUserProfile } from "@/types";


export const fetchUserData = async (username:string) => {
  try {
    const res = await api.get(`/users/user/`);
    console.log(res.data);
    const data = res.data
    const user: IUserProfile = {
      username: data.username,
      email: data.email,
    }
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
    const response = await api.post(`/auth/refresh/`, {
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


export const updateUser = async (data: IUserProfile) =>{
  try {
    const response = await api.put(`/users/${data.username}/`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}


