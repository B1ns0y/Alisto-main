import { useState, useEffect } from 'react';
import api from '@/middleware/api';

interface UseUserDataProps {
  navigate: (path: string) => void;
  toast: any;
}

export const useUserData = ({ navigate, toast }: UseUserDataProps) => {
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('user_data');
    return savedUserData ? JSON.parse(savedUserData) : {
      username: '',
      profilePicture: ''
    };
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/Home');
          return;
        }
        
        const response = await api.get('/users/user/');
        
        const user = {
          username: response.data.username,
          profilePicture: response.data.profilePicture || ''
        };
        
        setUserData(user);
        localStorage.setItem('user_data', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to load user data. Please log in again.",
          variant: "destructive",
        });
        navigate('/Home');
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  return { userData };
};