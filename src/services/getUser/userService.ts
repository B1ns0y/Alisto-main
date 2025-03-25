import api from "@/middleware/api";
import { IUserLoginData, IUserProfile, IUserProfileUpdate } from "@/interface/interfaces";

export const loginUser = async (data: IUserLoginData) => {
  try {
    const response = await api.post("/login/", data);
    return response;
  } catch (error) {
    throw error
  }
}

export const fetchUserData = async () => { // Removed unused username parameter
  try {
    const res = await api.get(`/user/`); 
    console.log(res.data);

    // Extracting and returning only relevant user data
    const user: IUserProfile = {
      username: res.data.username,
      email: res.data.email,
    };

    return user; // ✅ Return processed user data, not entire response
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

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
    const response = await api.put(`/users/update/`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error
  }
}




