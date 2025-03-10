import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  updateUser: (data: { username?: string; profilePicture?: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>('User');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Fetch user data from Django when the app loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUsername(response.data.username);
        setProfilePicture(response.data.profile_picture);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Function to update user details in Django
  const updateUser = async (data: { username?: string; profilePicture?: string }) => {
    try {
      const response = await axios.patch('http://127.0.0.1:8000/api/user/update/', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (data.username) setUsername(response.data.username);
      if (data.profilePicture) setProfilePicture(response.data.profile_picture);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ username, setUsername, profilePicture, setProfilePicture, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
