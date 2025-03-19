import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
  
  // Initialize user data from localStorage on hook mount
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const userEmail = localStorage.getItem("user_email");
    const userName = localStorage.getItem("user_name");
    
    if (userId && userEmail) {
      setUser({
        id: userId,
        email: userEmail,
        name: userName || '',
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false); // Set loading to false when done
  }, []);
  
  const logout = (): void => {
    // Clear all authentication tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    navigate("/login");
  };
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  };
  
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return false;
      
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem("access_token", response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      return false;
    }
  };
  
  return { 
    user,
    isAuthenticated,
    isLoading, // Add this to the return object
    logout,
    getAuthHeaders,
    refreshToken
  };
};