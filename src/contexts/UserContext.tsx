import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('User');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <UserContext.Provider 
      value={{ 
        username, 
        setUsername, 
        profilePicture, 
        setProfilePicture 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};