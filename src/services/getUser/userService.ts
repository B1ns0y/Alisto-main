import api from "@/middleware/api";
import { IUserLoginData, IUserProfile } from "@/interface/interfaces";

export const loginUser = async (data: IUserLoginData) => {
  try {
    const response = await api.post("/login/", data);
    return response;
  } catch (error) {
    throw error
  }
}

export const fetchUserData = async (data: IUserProfile) => {
  try {
    const res = await api.get(`/users/${data.username}`);
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


