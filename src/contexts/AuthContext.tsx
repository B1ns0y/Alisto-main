import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (tokens: TokenResponse) => void;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string };
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user_id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
  };
  
  useEffect(() => {
    // Check auth status on app load
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');
    const userName = localStorage.getItem('user_name');
   
    if (token && userId && userEmail) {
      setIsAuthenticated(true);
      setUser({
        id: userId,
        email: userEmail,
        name: userName || '',
      });
    }
  }, []);
  
  const login = (tokens: TokenResponse): void => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_id', tokens.user_id);
    localStorage.setItem('user_email', tokens.email);
    localStorage.setItem('user_name', tokens.name);
    
    setIsAuthenticated(true);
    setUser({
      id: tokens.user_id,
      email: tokens.email,
      name: tokens.name,
    });
    
    navigate('/dashboard');
  };
  
  const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};